package com.webcamera.platform.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.UserRepository;
import com.webcamera.platform.repository.CameraSerialRepository;
import com.webcamera.platform.repository.WarrantyRepository;
import com.webcamera.platform.repository.PaymentRepository;
import com.webcamera.platform.repository.OrderStatusEventRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=${TEST_DATABASE_URL:jdbc:h2:mem:order_service;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform}",
        "spring.datasource.username=${TEST_DATABASE_USER:sa}",
        "spring.datasource.password=${TEST_DATABASE_PASSWORD:}",
        "spring.flyway.enabled=false",
        "app.bank-transfer.account-number=0000000000",
        "app.bank-transfer.account-name=TEST ACCOUNT"
})
@Import({OrderService.class, InventoryService.class, PaymentService.class})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class OrderServiceIntegrationTest {
    @Autowired OrderService service;
    @Autowired OrderRepository orders;
    @Autowired ProductRepository products;
    @Autowired UserRepository users;
    @Autowired InventoryService inventory;
    @Autowired CameraSerialRepository serials;
    @Autowired WarrantyRepository warranties;
    @Autowired PaymentRepository payments;
    @Autowired PaymentService paymentService;
    @Autowired OrderStatusEventRepository statusEvents;

    @AfterEach
    void clean() {
        payments.deleteAll();
        statusEvents.deleteAll();
        warranties.deleteAll();
        serials.deleteAll();
        orders.deleteAll();
        products.deleteAll();
        users.deleteAll();
    }

    @Test
    void bankTransferConfirmationIsIdempotentAndMarksOrderPaid() {
        User customer = users.save(new User("payment@example.com", "Payment QA", "hash", User.Role.CUSTOMER));
        User admin = users.save(new User("payment-admin@example.com", "Admin QA", "hash", User.Role.ADMIN));
        Product camera = products.save(new Product("PAY-CAM", "Camera", new BigDecimal("100000"), 1));
        Order order = service.place(customer.getId(), List.of(new OrderService.Line(camera.getId(), 1)));

        var payment = paymentService.createForOrder(order.getId());
        paymentService.confirm(payment.getId(), admin.getId(), "MB-TRANSACTION-1");
        paymentService.confirm(payment.getId(), admin.getId(), "MB-TRANSACTION-1");

        Order paid = orders.findById(order.getId()).orElseThrow();
        assertThat(paid.getStatus()).isEqualTo(Order.Status.PAID);
        assertThat(paid.getPaymentStatus()).isEqualTo(Order.PaymentStatus.PAID);
        assertThat(payments.count()).isOne();
        assertThat(statusEvents.findByOrderIdOrderByRecordedAtAsc(order.getId()))
                .extracting(event -> event.getStatus())
                .containsExactly(Order.Status.PLACED, Order.Status.PENDING_PAYMENT, Order.Status.PAID);
    }

    @Test
    void placementPersistsPriceSnapshotAndDecrementsStock() {
        User customer = users.save(new User("order@example.com", "Order QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("ORDER-CAM", "Camera", new BigDecimal("99.90"), 2));

        Order order = service.place(customer.getId(), List.of(new OrderService.Line(camera.getId(), 1)));

        assertThat(order.getOrderNumber()).startsWith("JAVA-");
        assertThat(order.total()).isEqualByComparingTo("99.90");
        assertThat(order.getItems().getFirst().getProductSku()).isEqualTo("ORDER-CAM");
        assertThat(order.getItems().getFirst().getProductName()).isEqualTo("Camera");
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isOne();
        assertThat(statusEvents.findByOrderIdOrderByRecordedAtAsc(order.getId()))
                .extracting(event -> event.getStatus()).containsExactly(Order.Status.PLACED);
    }

    @Test
    void checkoutReturnsSameOrderAndReservesStockOnceForRepeatedKey() {
        User customer = users.save(new User("idempotent@example.com", "Idempotent QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("IDEMPOTENT-CAM", "Camera", BigDecimal.TEN, 2));
        var delivery = new OrderService.DeliveryDetails("Nguyễn Văn A", customer.getEmail(), "0900000000",
                "1 Nguyễn Huệ", "COD");

        Order first = service.checkout(customer.getId(), "checkout-123", List.of(
                new OrderService.Line(camera.getId(), 1)), delivery);
        Order retry = service.checkout(customer.getId(), "checkout-123", List.of(
                new OrderService.Line(camera.getId(), 1)), delivery);

        assertThat(retry.getId()).isEqualTo(first.getId());
        assertThat(orders.count()).isOne();
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isOne();
        assertThat(statusEvents.findByOrderIdOrderByRecordedAtAsc(first.getId())).hasSize(1);
    }

    @Test
    void checkoutRejectsReusingKeyForDifferentPayload() {
        User customer = users.save(new User("idempotency-conflict@example.com", "Conflict QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("IDEMPOTENCY-CONFLICT", "Camera", BigDecimal.TEN, 3));
        var delivery = new OrderService.DeliveryDetails("Nguyễn Văn A", customer.getEmail(), "0900000000",
                "1 Nguyễn Huệ", "COD");
        service.checkout(customer.getId(), "checkout-conflict", List.of(
                new OrderService.Line(camera.getId(), 1)), delivery);

        assertThatThrownBy(() -> service.checkout(customer.getId(), "checkout-conflict", List.of(
                new OrderService.Line(camera.getId(), 2)), delivery))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Idempotency key");
        assertThat(orders.count()).isOne();
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isEqualTo(2);
    }

    @Test
    void checkoutMergesDuplicateProductLinesBeforeReservation() {
        User customer = users.save(new User("merged-lines@example.com", "Merged QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("MERGED-LINES", "Camera", BigDecimal.TEN, 3));
        var delivery = new OrderService.DeliveryDetails("Nguyễn Văn A", customer.getEmail(), "0900000000",
                "1 Nguyễn Huệ", "COD");

        Order order = service.checkout(customer.getId(), "checkout-merged", List.of(
                new OrderService.Line(camera.getId(), 1), new OrderService.Line(camera.getId(), 1)), delivery);

        assertThat(order.getItems()).hasSize(1);
        assertThat(order.getItems().getFirst().getQuantity()).isEqualTo(2);
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isOne();
    }

    @Test
    void concurrentCheckoutWithSameKeyCreatesOneOrderAndOneReservation() throws Exception {
        User customer = users.save(new User("concurrent@example.com", "Concurrent QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("CONCURRENT-CAM", "Camera", BigDecimal.TEN, 2));
        var delivery = new OrderService.DeliveryDetails("Nguyễn Văn A", customer.getEmail(), "0900000000",
                "1 Nguyễn Huệ", "COD");
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);

        try (var executor = Executors.newFixedThreadPool(2)) {
            var first = executor.submit(() -> concurrentCheckout(ready, start, customer, camera, delivery));
            var second = executor.submit(() -> concurrentCheckout(ready, start, customer, camera, delivery));
            assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue();
            start.countDown();

            assertThat(first.get(10, TimeUnit.SECONDS)).isEqualTo(second.get(10, TimeUnit.SECONDS));
        }
        assertThat(orders.count()).isOne();
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isOne();
    }

    private UUID concurrentCheckout(CountDownLatch ready, CountDownLatch start, User customer, Product camera,
                                    OrderService.DeliveryDetails delivery) throws Exception {
        ready.countDown();
        if (!start.await(5, TimeUnit.SECONDS)) throw new IllegalStateException("Concurrent test did not start");
        return service.checkout(customer.getId(), "concurrent-key", List.of(
                new OrderService.Line(camera.getId(), 1)), delivery).getId();
    }

    @Test
    void trackingEnforcesOwnershipAndPersistsDeliverySnapshot() {
        User owner = users.save(new User("owner@example.com", "Order Owner", "hash", User.Role.CUSTOMER));
        User stranger = users.save(new User("stranger@example.com", "Stranger", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("TRACK-CAM", "Tracking Camera", BigDecimal.TEN, 1));
        Order order = service.place(owner.getId(), List.of(new OrderService.Line(camera.getId(), 1)),
                new OrderService.DeliveryDetails("Nguyễn Văn A", "owner@example.com", "0900000000",
                        "1 Nguyễn Huệ, TP.HCM", "COD"));

        var details = service.customerOrder(owner.getId(), order.getOrderNumber());

        assertThat(details.recipientName()).isEqualTo("Nguyễn Văn A");
        assertThat(details.shippingAddress()).isEqualTo("1 Nguyễn Huệ, TP.HCM");
        assertThat(details.items().getFirst().name()).isEqualTo("Tracking Camera");
        assertThatThrownBy(() -> service.customerOrder(stranger.getId(), order.getOrderNumber()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Không tìm thấy đơn hàng");
    }

    @Test
    void customerCanCancelOnlyOwnEarlyOrderAndStockIsRestored() {
        User owner = users.save(new User("cancel-owner@example.com", "Cancel Owner", "hash", User.Role.CUSTOMER));
        User stranger = users.save(new User("cancel-stranger@example.com", "Cancel Stranger", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("CUSTOMER-CANCEL", "Camera", BigDecimal.TEN, 2));
        Order order = service.place(owner.getId(), List.of(new OrderService.Line(camera.getId(), 1)));

        assertThatThrownBy(() -> service.cancelForCustomer(stranger.getId(), order.getOrderNumber(), "IDOR"))
                .isInstanceOf(IllegalArgumentException.class);
        var cancelled = service.cancelForCustomer(owner.getId(), order.getOrderNumber(), "Đổi nhu cầu");

        assertThat(cancelled.status()).isEqualTo(Order.Status.CANCELLED);
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isEqualTo(2);
        assertThatThrownBy(() -> service.cancelForCustomer(owner.getId(), order.getOrderNumber(), "Lặp lại"))
                .isInstanceOf(IllegalStateException.class);
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isEqualTo(2);
    }

    @Test
    void laterInsufficientLineRollsBackEarlierReservationAndOrder() {
        User customer = users.save(new User("rollback@example.com", "Rollback QA", "hash", User.Role.CUSTOMER));
        Product available = products.save(new Product("ROLLBACK-OK", "Available", BigDecimal.TEN, 2));
        Product unavailable = products.save(new Product("ROLLBACK-NO", "Unavailable", BigDecimal.ONE, 0));

        assertThatThrownBy(() -> service.place(customer.getId(), List.of(
                new OrderService.Line(available.getId(), 1),
                new OrderService.Line(unavailable.getId(), 1))))
                .isInstanceOf(IllegalStateException.class);

        assertThat(products.findById(available.getId()).orElseThrow().getStockQuantity()).isEqualTo(2);
        assertThat(orders.count()).isZero();
    }

    @Test
    void cancellationRestoresStockExactlyOnce() {
        User customer = users.save(new User("cancel@example.com", "Cancel QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("CANCEL-CAM", "Camera", BigDecimal.TEN, 3));
        Order order = service.place(customer.getId(), List.of(new OrderService.Line(camera.getId(), 2)));

        service.cancel(order.getId(), "Customer request");

        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isEqualTo(3);
        assertThatThrownBy(() -> service.cancel(order.getId(), "Duplicate request"))
                .isInstanceOf(IllegalStateException.class);
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isEqualTo(3);
    }

    @Test
    void serialCanBeSoldOnceAndCreatesWarranty() {
        User customer = users.save(new User("serial@example.com", "Serial QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("SERIAL-CAM", "Camera", BigDecimal.TEN, 1));
        Order order = service.place(customer.getId(), List.of(new OrderService.Line(camera.getId(), 1)));
        var serial = inventory.register(camera.getId(), "sn-001");

        var warranty = inventory.sell(serial.getId(), order.getItems().getFirst().getId(), 24);

        assertThat(warranty.getCameraSerial().getSerialNumber()).isEqualTo("SN-001");
        assertThat(warranty.getExpiresOn()).isEqualTo(warranty.getStartsOn().plusMonths(24));
        assertThatThrownBy(() -> inventory.sell(serial.getId(), order.getItems().getFirst().getId(), 24))
                .isInstanceOf(IllegalStateException.class);
        assertThat(warranties.count()).isOne();
    }

    @Test
    void serialRegistrationRejectsCaseInsensitiveDuplicate() {
        Product camera = products.save(new Product("DUP-SERIAL-CAM", "Camera", BigDecimal.TEN, 1));
        inventory.register(camera.getId(), "sn-duplicate");

        assertThatThrownBy(() -> inventory.register(camera.getId(), "SN-DUPLICATE"))
                .isInstanceOf(IllegalArgumentException.class);
        assertThat(serials.count()).isOne();
    }
}

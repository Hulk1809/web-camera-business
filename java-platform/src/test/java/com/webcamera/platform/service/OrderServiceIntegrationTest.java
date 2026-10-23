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
import java.math.BigDecimal;
import java.util.List;
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
        "spring.datasource.url=jdbc:h2:mem:order_service;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform",
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

    @AfterEach
    void clean() {
        payments.deleteAll();
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
    }

    @Test
    void placementPersistsPriceSnapshotAndDecrementsStock() {
        User customer = users.save(new User("order@example.com", "Order QA", "hash", User.Role.CUSTOMER));
        Product camera = products.save(new Product("ORDER-CAM", "Camera", new BigDecimal("99.90"), 2));

        Order order = service.place(customer.getId(), List.of(new OrderService.Line(camera.getId(), 1)));

        assertThat(order.getOrderNumber()).startsWith("JAVA-");
        assertThat(order.total()).isEqualByComparingTo("99.90");
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isOne();
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

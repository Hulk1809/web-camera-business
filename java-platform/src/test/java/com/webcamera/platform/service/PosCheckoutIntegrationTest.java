package com.webcamera.platform.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.webcamera.platform.domain.CameraSerial;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Payment;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.CameraSerialRepository;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.OrderStatusEventRepository;
import com.webcamera.platform.repository.PaymentRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.UserRepository;
import com.webcamera.platform.repository.WarrantyRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=${TEST_DATABASE_URL:jdbc:h2:mem:pos_checkout;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform}",
        "spring.datasource.username=${TEST_DATABASE_USER:sa}",
        "spring.datasource.password=${TEST_DATABASE_PASSWORD:}",
        "spring.flyway.enabled=false",
        "app.bank-transfer.account-number=0000000000",
        "app.bank-transfer.account-name=TEST ACCOUNT"
})
@Import({OrderService.class, InventoryService.class, PaymentService.class, PosCheckoutService.class})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class PosCheckoutIntegrationTest {
    @Autowired PosCheckoutService checkout;
    @Autowired PaymentService paymentService;
    @Autowired OrderService orderService;
    @Autowired ProductRepository products;
    @Autowired UserRepository users;
    @Autowired OrderRepository orders;
    @Autowired PaymentRepository payments;
    @Autowired CameraSerialRepository serials;
    @Autowired WarrantyRepository warranties;
    @Autowired OrderStatusEventRepository events;

    @AfterEach
    void clean() {
        warranties.deleteAll();
        serials.deleteAll();
        payments.deleteAll();
        events.deleteAll();
        orders.deleteAll();
        products.deleteAll();
        users.deleteAll();
    }

    @Test
    void cashCheckoutCompletesOrderSerialAndWarrantyAtomically() {
        User staff = staff("cash");
        Product camera = products.save(new Product("POS-CASH", "Cash Camera", BigDecimal.TEN, 1));
        CameraSerial serial = register(camera, "POS-CASH-SERIAL");

        var result = checkout.checkout(staff.getId(), List.of(new OrderService.Line(camera.getId(), 1)),
                PosCheckoutService.Method.CASH);

        assertThat(result.payment()).isNull();
        assertThat(result.order().getStatus()).isEqualTo(Order.Status.COMPLETED);
        assertThat(serials.findById(serial.getId()).orElseThrow().getStatus()).isEqualTo(CameraSerial.Status.SOLD);
        assertThat(warranties.count()).isOne();
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isZero();
    }

    @Test
    void vietQrReservesUntilConfirmationThenCompletesEverything() {
        User staff = staff("vietqr");
        Product camera = products.save(new Product("POS-QR", "QR Camera", BigDecimal.TEN, 1));
        CameraSerial serial = register(camera, "POS-QR-SERIAL");

        var result = checkout.checkout(staff.getId(), List.of(new OrderService.Line(camera.getId(), 1)),
                PosCheckoutService.Method.VIETQR);

        assertThat(result.order().getStatus()).isEqualTo(Order.Status.PENDING_PAYMENT);
        assertThat(result.payment().getStatus()).isEqualTo(Payment.Status.PENDING);
        assertThat(serials.findById(serial.getId()).orElseThrow().getStatus()).isEqualTo(CameraSerial.Status.RESERVED);
        assertThat(warranties.count()).isZero();

        paymentService.confirm(result.payment().getId(), staff.getId(), "MB-POS-QR-1");

        assertThat(orders.findById(result.order().getId()).orElseThrow().getStatus()).isEqualTo(Order.Status.COMPLETED);
        assertThat(serials.findById(serial.getId()).orElseThrow().getStatus()).isEqualTo(CameraSerial.Status.SOLD);
        assertThat(warranties.count()).isOne();
    }

    @Test
    void anySerialFailureRollsBackOrderStockAndWarranty() {
        User staff = staff("rollback");
        Product camera = products.save(new Product("POS-ROLLBACK", "Rollback Camera", BigDecimal.TEN, 2));
        register(camera, "POS-ROLLBACK-ONLY-ONE");

        assertThatThrownBy(() -> checkout.checkout(staff.getId(),
                List.of(new OrderService.Line(camera.getId(), 2)), PosCheckoutService.Method.CASH))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Not enough serial numbers");

        assertThat(orders.count()).isZero();
        assertThat(warranties.count()).isZero();
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isEqualTo(2);
        assertThat(serials.findAll()).allMatch(item -> item.getStatus() == CameraSerial.Status.IN_STOCK);
    }

    @Test
    void cancellingPendingVietQrReleasesStockSerialAndPayment() {
        User staff = staff("cancel");
        Product camera = products.save(new Product("POS-CANCEL", "Cancel Camera", BigDecimal.TEN, 1));
        CameraSerial serial = register(camera, "POS-CANCEL-SERIAL");
        var result = checkout.checkout(staff.getId(), List.of(new OrderService.Line(camera.getId(), 1)),
                PosCheckoutService.Method.VIETQR);

        orderService.cancel(result.order().getId(), "Customer changed mind");

        assertThat(orders.findById(result.order().getId()).orElseThrow().getStatus()).isEqualTo(Order.Status.CANCELLED);
        assertThat(payments.findById(result.payment().getId()).orElseThrow().getStatus()).isEqualTo(Payment.Status.CANCELLED);
        assertThat(serials.findById(serial.getId()).orElseThrow().getStatus()).isEqualTo(CameraSerial.Status.IN_STOCK);
        assertThat(products.findById(camera.getId()).orElseThrow().getStockQuantity()).isOne();
    }

    private User staff(String suffix) {
        return users.save(new User("pos-" + suffix + "@example.com", "POS Staff", "hash", User.Role.STAFF));
    }

    private CameraSerial register(Product product, String serial) {
        return serials.save(new CameraSerial(product, serial));
    }
}

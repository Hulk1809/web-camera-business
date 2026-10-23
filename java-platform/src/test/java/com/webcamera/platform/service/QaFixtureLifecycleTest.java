package com.webcamera.platform.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.QaFixtureRepository;
import com.webcamera.platform.repository.UserRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=jdbc:h2:mem:qa_fixture;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform",
        "spring.flyway.enabled=false",
        "app.qa-fixtures.enabled=true",
        "app.bank-transfer.account-number=0000000000",
        "app.bank-transfer.account-name=TEST ACCOUNT"
})
@Import({OrderService.class, PaymentService.class, QaFixtureService.class, QaFixtureLifecycleTest.CryptoConfig.class})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class QaFixtureLifecycleTest {
    @TestConfiguration
    static class CryptoConfig {
        @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(4); }
    }

    @Autowired QaFixtureService fixtures;
    @Autowired QaFixtureRepository fixtureRepository;
    @Autowired ProductRepository products;
    @Autowired UserRepository users;
    @Autowired OrderRepository orders;

    @Test
    void lifecycleUsesNamespaceAdvancesAndCleansOnlyFixtureData() {
        Product realProduct = products.save(new Product("REAL-DO-NOT-TOUCH", "Real product", BigDecimal.TEN, 5));
        var created = fixtures.create("order-readback", 300);

        assertThat(created.status()).isEqualTo("READY");
        assertThat(created.productSku()).startsWith("QA-FIXTURE-");
        assertThat(created.orderStatus()).isEqualTo(Order.Status.PENDING_PAYMENT);
        assertThat(fixtures.advance(created.id()).orderStatus()).isEqualTo(Order.Status.PAID);
        assertThat(fixtures.advance(created.id()).orderStatus()).isEqualTo(Order.Status.CONFIRMED);
        assertThat(fixtures.advance(created.id()).orderStatus()).isEqualTo(Order.Status.PROCESSING);
        assertThat(fixtures.advance(created.id()).orderStatus()).isEqualTo(Order.Status.SHIPPED);
        var completed = fixtures.advance(created.id());
        assertThat(completed.orderStatus()).isEqualTo(Order.Status.COMPLETED);
        assertThat(completed.paymentStatus()).isEqualTo(Order.PaymentStatus.PAID);
        assertThat(completed.timeline()).extracting(OrderService.StatusEvent::status)
                .containsExactly(Order.Status.PLACED, Order.Status.PENDING_PAYMENT, Order.Status.PAID,
                        Order.Status.CONFIRMED, Order.Status.PROCESSING, Order.Status.SHIPPED, Order.Status.COMPLETED);

        fixtures.cleanup(created.id());

        assertThat(fixtureRepository.findById(created.id())).isEmpty();
        assertThat(orders.findByOrderNumber(created.orderNumber())).isEmpty();
        assertThat(products.findBySkuIgnoreCase(created.productSku())).isEmpty();
        assertThat(users.findAll()).noneMatch(user -> user.getEmail().startsWith("qa-fixture+"));
        assertThat(products.findById(realProduct.getId())).isPresent();
    }
}

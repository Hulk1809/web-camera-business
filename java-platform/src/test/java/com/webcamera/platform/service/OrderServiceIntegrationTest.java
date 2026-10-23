package com.webcamera.platform.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.UserRepository;
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
        "spring.flyway.enabled=false"
})
@Import(OrderService.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class OrderServiceIntegrationTest {
    @Autowired OrderService service;
    @Autowired OrderRepository orders;
    @Autowired ProductRepository products;
    @Autowired UserRepository users;

    @AfterEach
    void clean() {
        orders.deleteAll();
        products.deleteAll();
        users.deleteAll();
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
}

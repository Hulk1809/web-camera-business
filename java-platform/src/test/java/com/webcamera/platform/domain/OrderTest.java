package com.webcamera.platform.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class OrderTest {
    @Test
    void calculatesTotalAndRequiresItemsBeforePlacement() {
        User customer = new User("buyer@example.com", "Buyer", "hash", User.Role.CUSTOMER);
        Product product = new Product("CAM-1", "Camera", new BigDecimal("125.50"), 3);
        Order order = new Order(customer);

        assertThatThrownBy(order::place).isInstanceOf(IllegalStateException.class);
        order.addItem(product, 2);
        order.place();

        assertThat(order.total()).isEqualByComparingTo("251.00");
        assertThat(order.getStatus()).isEqualTo(Order.Status.PLACED);
    }

    @Test
    void stockCannotBeOverReserved() {
        Product product = new Product("CAM-2", "Camera", BigDecimal.TEN, 1);
        assertThatThrownBy(() -> product.reserve(2)).isInstanceOf(IllegalStateException.class);
        assertThat(product.getStockQuantity()).isOne();
    }

    @Test
    void enforcesForwardOnlyOrderStatusTransitions() {
        User customer = new User("state@example.com", "State QA", "hash", User.Role.CUSTOMER);
        Product product = new Product("STATE-CAM", "Camera", BigDecimal.TEN, 1);
        Order order = new Order(customer);
        order.addItem(product, 1);
        order.place();

        assertThatThrownBy(() -> order.changeStatus(Order.Status.COMPLETED))
                .isInstanceOf(IllegalStateException.class);
        order.changeStatus(Order.Status.CONFIRMED);
        order.changeStatus(Order.Status.SHIPPED);
        order.changeStatus(Order.Status.COMPLETED);
        assertThat(order.getStatus()).isEqualTo(Order.Status.COMPLETED);
        assertThat(order.getPaymentStatus()).isEqualTo(Order.PaymentStatus.PAID);
    }
}

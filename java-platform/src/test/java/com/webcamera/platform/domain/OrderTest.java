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
}

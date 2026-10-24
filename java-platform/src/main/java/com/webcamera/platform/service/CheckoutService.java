package com.webcamera.platform.service;

import com.webcamera.platform.domain.Order;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {
    private final OrderService orders;
    private final PaymentService payments;

    public CheckoutService(OrderService orders, PaymentService payments) {
        this.orders = orders;
        this.payments = payments;
    }

    @Transactional
    public Order checkout(UUID customerId, String idempotencyKey, List<OrderService.Line> lines,
                          OrderService.DeliveryDetails delivery) {
        Order order = orders.checkout(customerId, idempotencyKey, lines, delivery);
        if ("VietQR MB Bank".equals(delivery.paymentMethod())) payments.createForOrder(order.getId());
        return order;
    }
}

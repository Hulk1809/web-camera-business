package com.webcamera.platform.service;

import com.webcamera.platform.domain.CameraSerial;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.OrderItem;
import com.webcamera.platform.domain.Payment;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PosCheckoutService {
    public enum Method { CASH, VIETQR, CREDIT_CARD }
    public record Result(Order order, Payment payment) {}

    private final OrderService orders;
    private final InventoryService inventory;
    private final PaymentService payments;

    public PosCheckoutService(OrderService orders, InventoryService inventory, PaymentService payments) {
        this.orders = orders;
        this.inventory = inventory;
        this.payments = payments;
    }

    @Transactional
    public Result checkout(UUID staffId, List<OrderService.Line> lines, Method method) {
        if (method == null) throw new IllegalArgumentException("Payment method is required");
        boolean pendingBankTransfer = method == Method.VIETQR;
        Order order = pendingBankTransfer ? orders.placePosPending(staffId, lines) : orders.placePos(staffId, lines);
        assignAvailableSerials(order, pendingBankTransfer);
        Payment payment = pendingBankTransfer ? payments.createForOrder(order.getId()) : null;
        return new Result(order, payment);
    }

    private void assignAvailableSerials(Order order, boolean reserveOnly) {
        for (OrderItem item : order.getItems()) {
            List<CameraSerial> available = inventory.availableSerials(item.getProduct().getId());
            if (!available.isEmpty() && available.size() < item.getQuantity()) {
                throw new IllegalStateException("Not enough serial numbers available for " + item.getProductName());
            }
            for (CameraSerial serial : available.stream().limit(item.getQuantity()).toList()) {
                if (reserveOnly) inventory.reserve(serial.getId(), item.getId());
                else inventory.sell(serial.getId(), item.getId(), 24);
            }
        }
    }
}

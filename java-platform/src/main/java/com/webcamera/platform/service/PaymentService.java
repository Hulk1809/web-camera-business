package com.webcamera.platform.service;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Payment;
import com.webcamera.platform.domain.OrderStatusEvent;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.PaymentRepository;
import com.webcamera.platform.repository.OrderStatusEventRepository;
import com.webcamera.platform.repository.UserRepository;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {
    public record Instructions(UUID paymentId, String bankName, String accountNumber, String accountName,
                               String transferContent, java.math.BigDecimal amount, String qrUrl, Payment.Status status) {}

    private final PaymentRepository payments;
    private final OrderRepository orders;
    private final UserRepository users;
    private final OrderStatusEventRepository statusEvents;
    private final InventoryService inventory;
    private final String accountNumber;
    private final String accountName;

    public PaymentService(PaymentRepository payments, OrderRepository orders, UserRepository users,
                          OrderStatusEventRepository statusEvents, InventoryService inventory,
                          @Value("${app.bank-transfer.account-number:}") String accountNumber,
                          @Value("${app.bank-transfer.account-name:}") String accountName) {
        this.payments = payments; this.orders = orders; this.users = users; this.statusEvents = statusEvents;
        this.inventory = inventory;
        this.accountNumber = accountNumber.trim(); this.accountName = accountName.trim();
    }

    @Transactional
    public Payment createForOrder(UUID orderId) {
        requireConfigured();
        return payments.findByOrderId(orderId).orElseGet(() -> {
            Order order = orders.findByIdForUpdate(orderId).orElseThrow(() -> new IllegalArgumentException("Unknown order"));
            order.awaitPayment();
            statusEvents.save(new OrderStatusEvent(order, order.getStatus(), "Đang chờ thanh toán"));
            return payments.save(new Payment(order, order.total(), "TT " + order.getOrderNumber()));
        });
    }

    @Transactional(readOnly = true)
    public Instructions instructions(UUID orderId, String customerEmail) {
        Payment payment = payments.findByOrderId(orderId).orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        if (!payment.getOrder().getCustomer().getEmail().equalsIgnoreCase(customerEmail))
            throw new IllegalArgumentException("Payment not found");
        return toInstructions(payment);
    }

    @Transactional(readOnly = true)
    public List<Payment> all() { return payments.findAllByOrderByCreatedAtDesc(); }

    @Transactional
    public Payment confirm(UUID paymentId, UUID staffId, String bankReference) {
        Payment payment = payments.findByIdForUpdate(paymentId).orElseThrow(() -> new IllegalArgumentException("Unknown payment"));
        User staff = users.findById(staffId).orElseThrow(() -> new IllegalArgumentException("Unknown staff"));
        boolean alreadyPaid = payment.getStatus() == Payment.Status.PAID;
        payment.confirm(staff, bankReference);
        if (!alreadyPaid) {
            if (payment.getOrder().getSalesChannel() == Order.SalesChannel.POS) {
                inventory.completeReservedSales(payment.getOrder().getId(), 24);
                payment.getOrder().completePosPayment();
            }
            statusEvents.save(new OrderStatusEvent(payment.getOrder(), payment.getOrder().getStatus(), "Đã xác nhận thanh toán"));
        }
        return payment;
    }

    public Instructions toInstructions(Payment payment) {
        requireConfigured();
        String encodedContent = URLEncoder.encode(payment.getTransferContent(), StandardCharsets.UTF_8);
        String encodedName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);
        String amount = payment.getAmount().stripTrailingZeros().toPlainString();
        String qr = "https://img.vietqr.io/image/MB-" + accountNumber + "-compact2.png?amount=" + amount
                + "&addInfo=" + encodedContent + "&accountName=" + encodedName;
        return new Instructions(payment.getId(), "MB Bank", accountNumber, accountName,
                payment.getTransferContent(), payment.getAmount(), qr, payment.getStatus());
    }

    private void requireConfigured() {
        if (accountNumber.isBlank() || accountName.isBlank()) throw new IllegalStateException("Bank transfer is not configured");
    }
}

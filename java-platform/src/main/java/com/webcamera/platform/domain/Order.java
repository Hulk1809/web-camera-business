package com.webcamera.platform.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.Instant;
import java.util.EnumSet;

@Entity
@Table(name = "customer_order", schema = "camera_platform")
public class Order extends BaseEntity {
    public enum Status { DRAFT, PLACED, PENDING_PAYMENT, PAID, CONFIRMED, PROCESSING, SHIPPED, COMPLETED, CANCELLED }
    public enum PaymentStatus { UNPAID, PENDING, AUTHORIZED, PAID, PARTIALLY_REFUNDED, REFUNDED, FAILED }
    public enum SalesChannel { ONLINE, POS }
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User customer;
    @Column(name = "order_number", nullable = false, unique = true, length = 32)
    private String orderNumber;
    @Enumerated(EnumType.STRING)
    @jakarta.persistence.Column(nullable = false, length = 20)
    private Status status = Status.DRAFT;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 24)
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;
    @Enumerated(EnumType.STRING)
    @Column(name = "sales_channel", nullable = false, length = 20)
    private SalesChannel salesChannel = SalesChannel.ONLINE;
    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;
    @Column(name = "cancelled_at")
    private Instant cancelledAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected Order() {}
    public Order(User customer) { this(customer, SalesChannel.ONLINE); }
    public Order(User customer, SalesChannel salesChannel) {
        this.customer = customer;
        this.salesChannel = salesChannel != null ? salesChannel : SalesChannel.ONLINE;
    }
    public void addItem(Product product, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be positive");
        items.add(new OrderItem(this, product, product.getPrice(), quantity));
    }
    public BigDecimal total() { return items.stream().map(OrderItem::subtotal).reduce(BigDecimal.ZERO, BigDecimal::add); }
    public User getCustomer() { return customer; }
    public String getOrderNumber() { return orderNumber; }
    public Status getStatus() { return status; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public SalesChannel getSalesChannel() { return salesChannel; }
    public String getCancellationReason() { return cancellationReason; }
    public List<OrderItem> getItems() { return List.copyOf(items); }
    public void place() { if (items.isEmpty()) throw new IllegalStateException("Cannot place an empty order"); status = Status.PLACED; }
    public void completePosSale() {
        if (items.isEmpty()) throw new IllegalStateException("Cannot place an empty order");
        status = Status.COMPLETED;
        paymentStatus = PaymentStatus.PAID;
    }
    public void awaitPayment() {
        if (status == Status.PENDING_PAYMENT && paymentStatus == PaymentStatus.PENDING) return;
        if (status != Status.PLACED) throw new IllegalStateException("Order cannot await payment from " + status);
        status = Status.PENDING_PAYMENT;
        paymentStatus = PaymentStatus.PENDING;
    }
    public void markPaid() {
        if (paymentStatus == PaymentStatus.PAID) return;
        if (status != Status.PENDING_PAYMENT || paymentStatus != PaymentStatus.PENDING)
            throw new IllegalStateException("Order cannot be paid from " + status);
        status = Status.PAID;
        paymentStatus = PaymentStatus.PAID;
    }
    public void changeStatus(Status next) {
        if (next == null || !allowedTransitions(status).contains(next))
            throw new IllegalStateException("Invalid order status transition: " + status + " -> " + next);
        status = next;
        if (next == Status.PAID || next == Status.COMPLETED) paymentStatus = PaymentStatus.PAID;
    }
    public void cancel(String reason) {
        if (status != Status.PLACED && status != Status.PENDING_PAYMENT && status != Status.CONFIRMED) {
            throw new IllegalStateException("Order can no longer be cancelled");
        }
        status = Status.CANCELLED;
        cancellationReason = reason == null ? "" : reason.trim();
        cancelledAt = Instant.now();
    }
    @PrePersist
    void assignOrderNumber() {
        if (orderNumber == null) orderNumber = "JAVA-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }
    private static EnumSet<Status> allowedTransitions(Status current) {
        return switch (current) {
            case DRAFT -> EnumSet.of(Status.PLACED);
            case PLACED -> EnumSet.of(Status.PENDING_PAYMENT, Status.PAID, Status.CONFIRMED);
            case PENDING_PAYMENT -> EnumSet.of(Status.PAID, Status.CONFIRMED);
            case PAID -> EnumSet.of(Status.CONFIRMED, Status.PROCESSING);
            case CONFIRMED -> EnumSet.of(Status.PROCESSING, Status.SHIPPED);
            case PROCESSING -> EnumSet.of(Status.SHIPPED);
            case SHIPPED -> EnumSet.of(Status.COMPLETED);
            case COMPLETED, CANCELLED -> EnumSet.noneOf(Status.class);
        };
    }
}

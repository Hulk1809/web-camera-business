package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payment", schema = "camera_platform")
public class Payment extends BaseEntity {
    public enum Status { PENDING, AUTHORIZED, PAID, PARTIALLY_REFUNDED, REFUNDED, FAILED, CANCELLED }

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    @Column(nullable = false, length = 40)
    private String provider;
    @Column(name = "provider_reference", length = 120)
    private String providerReference;
    @Column(nullable = false, length = 30)
    private String method;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Status status;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;
    @Column(name = "transfer_content", length = 80)
    private String transferContent;
    @Column(name = "paid_at")
    private Instant paidAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confirmed_by_id")
    private User confirmedBy;
    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    protected Payment() {}
    public Payment(Order order, BigDecimal amount, String transferContent) {
        this.order = order;
        this.amount = amount;
        this.transferContent = transferContent;
        this.provider = "MB_BANK";
        this.method = "BANK_TRANSFER";
        this.status = Status.PENDING;
    }
    public void confirm(User staff, String bankReference) {
        if (status == Status.PAID) return;
        if (status != Status.PENDING) throw new IllegalStateException("Payment cannot be confirmed from " + status);
        if (bankReference == null || bankReference.isBlank()) throw new IllegalArgumentException("Bank reference is required");
        status = Status.PAID;
        providerReference = bankReference.trim();
        confirmedBy = staff;
        confirmedAt = paidAt = Instant.now();
        order.markPaid();
    }
    public Order getOrder() { return order; }
    public String getProviderReference() { return providerReference; }
    public Status getStatus() { return status; }
    public BigDecimal getAmount() { return amount; }
    public String getTransferContent() { return transferContent; }
    public Instant getPaidAt() { return paidAt; }
}

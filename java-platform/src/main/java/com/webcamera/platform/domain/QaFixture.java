package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "qa_fixture", schema = "camera_platform")
public class QaFixture extends BaseEntity {
    @Column(nullable = false, length = 40)
    private String scenario;
    @Column(nullable = false, length = 20)
    private String status;
    @Column(name = "customer_id", nullable = false)
    private UUID customerId;
    @Column(name = "staff_id", nullable = false)
    private UUID staffId;
    @Column(name = "product_id", nullable = false)
    private UUID productId;
    @Column(name = "order_id", nullable = false)
    private UUID orderId;
    @Column(name = "payment_id", nullable = false)
    private UUID paymentId;
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    protected QaFixture() {}

    public QaFixture(String scenario, UUID customerId, UUID staffId, UUID productId,
                     UUID orderId, UUID paymentId, Instant expiresAt) {
        this.scenario = scenario;
        this.status = "READY";
        this.customerId = customerId;
        this.staffId = staffId;
        this.productId = productId;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.expiresAt = expiresAt;
    }

    public String getScenario() { return scenario; }
    public String getStatus() { return status; }
    public UUID getCustomerId() { return customerId; }
    public UUID getStaffId() { return staffId; }
    public UUID getProductId() { return productId; }
    public UUID getOrderId() { return orderId; }
    public UUID getPaymentId() { return paymentId; }
    public Instant getExpiresAt() { return expiresAt; }
}

package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "order_status_event", schema = "camera_platform")
public class OrderStatusEvent extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Order.Status status;
    @Column(nullable = false, length = 240)
    private String note;
    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    protected OrderStatusEvent() {}

    public OrderStatusEvent(Order order, Order.Status status, String note) {
        this.order = order;
        this.status = status;
        this.note = note == null ? "" : note.trim();
        this.recordedAt = Instant.now();
    }

    public Order.Status getStatus() { return status; }
    public String getNote() { return note; }
    public Instant getRecordedAt() { return recordedAt; }
}

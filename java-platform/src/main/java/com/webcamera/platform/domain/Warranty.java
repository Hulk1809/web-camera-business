package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "warranty", schema = "camera_platform")
public class Warranty extends BaseEntity {
    public enum Status { ACTIVE, EXPIRED, VOIDED, CLAIMED }

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "camera_serial_id", nullable = false, unique = true)
    private CameraSerial cameraSerial;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    @Column(name = "starts_on", nullable = false)
    private LocalDate startsOn;
    @Column(name = "expires_on", nullable = false)
    private LocalDate expiresOn;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.ACTIVE;

    protected Warranty() {}
    public Warranty(CameraSerial serial, User customer, Order order, LocalDate startsOn, LocalDate expiresOn) {
        if (expiresOn.isBefore(startsOn)) throw new IllegalArgumentException("Warranty expiry precedes start");
        this.cameraSerial = serial; this.customer = customer; this.order = order;
        this.startsOn = startsOn; this.expiresOn = expiresOn;
    }
    public CameraSerial getCameraSerial() { return cameraSerial; }
    public User getCustomer() { return customer; }
    public Order getOrder() { return order; }
    public LocalDate getStartsOn() { return startsOn; }
    public LocalDate getExpiresOn() { return expiresOn; }
    public Status getStatus() { return status; }
    public void claim() {
        if (status != Status.ACTIVE) throw new IllegalStateException("Only active warranty can be claimed");
        if (LocalDate.now().isAfter(expiresOn)) {
            status = Status.EXPIRED;
            throw new IllegalStateException("Warranty has expired");
        }
        status = Status.CLAIMED;
    }
}

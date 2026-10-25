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
import java.time.Instant;

@Entity
@Table(name = "camera_serial", schema = "camera_platform")
public class CameraSerial extends BaseEntity {
    public enum Status { IN_STOCK, RESERVED, SOLD, RETURNED, SERVICE, RETIRED }

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(name = "serial_number", nullable = false, unique = true, length = 120)
    private String serialNumber;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.IN_STOCK;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;
    @Column(name = "sold_at")
    private Instant soldAt;

    protected CameraSerial() {}
    public CameraSerial(Product product, String serialNumber) {
        if (serialNumber == null || serialNumber.isBlank()) throw new IllegalArgumentException("Serial number is required");
        this.product = product;
        this.serialNumber = serialNumber.trim().toUpperCase();
    }
    public Product getProduct() { return product; }
    public String getSerialNumber() { return serialNumber; }
    public Status getStatus() { return status; }
    public OrderItem getOrderItem() { return orderItem; }
    public Instant getSoldAt() { return soldAt; }
    public void reserve(OrderItem item) {
        if (status != Status.IN_STOCK || item == null || !item.getProduct().getId().equals(product.getId()))
            throw new IllegalStateException("Serial cannot be reserved for this order item");
        status = Status.RESERVED;
        orderItem = item;
    }
    public void completeReservedSale() {
        if (status != Status.RESERVED || orderItem == null)
            throw new IllegalStateException("Only a reserved serial can complete sale");
        status = Status.SOLD;
        soldAt = Instant.now();
    }
    public void releaseReservation() {
        if (status != Status.RESERVED) throw new IllegalStateException("Only a reserved serial can be released");
        status = Status.IN_STOCK;
        orderItem = null;
    }
    public void sell(OrderItem item) {
        if (status != Status.IN_STOCK || item == null || !item.getProduct().getId().equals(product.getId()))
            throw new IllegalStateException("Serial cannot be sold for this order item");
        status = Status.SOLD;
        orderItem = item;
        soldAt = Instant.now();
    }
}

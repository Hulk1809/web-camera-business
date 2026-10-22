package com.webcamera.platform.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_order", schema = "camera_platform")
public class Order extends BaseEntity {
    public enum Status { DRAFT, PLACED, PAID, SHIPPED, CANCELLED }
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User customer;
    @Enumerated(EnumType.STRING)
    @jakarta.persistence.Column(nullable = false, length = 20)
    private Status status = Status.DRAFT;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected Order() {}
    public Order(User customer) { this.customer = customer; }
    public void addItem(Product product, int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be positive");
        items.add(new OrderItem(this, product, product.getPrice(), quantity));
    }
    public BigDecimal total() { return items.stream().map(OrderItem::subtotal).reduce(BigDecimal.ZERO, BigDecimal::add); }
    public User getCustomer() { return customer; }
    public Status getStatus() { return status; }
    public List<OrderItem> getItems() { return List.copyOf(items); }
    public void place() { if (items.isEmpty()) throw new IllegalStateException("Cannot place an empty order"); status = Status.PLACED; }
}

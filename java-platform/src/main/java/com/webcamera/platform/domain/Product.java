package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "product", schema = "camera_platform")
public class Product extends BaseEntity {
    @Column(nullable = false, unique = true, length = 80)
    private String sku;
    @Column(nullable = false, length = 180)
    private String name;
    @Column(nullable = false, length = 2000)
    private String description = "";
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    @Column(nullable = false)
    private int stockQuantity;
    @Column(nullable = false)
    private boolean active = true;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private Map<String, String> specifications = new LinkedHashMap<>();

    protected Product() {}
    public Product(String sku, String name, BigDecimal price, int stockQuantity) {
        if (price.signum() < 0 || stockQuantity < 0) throw new IllegalArgumentException("Price and stock must be non-negative");
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public int getStockQuantity() { return stockQuantity; }
    public boolean isActive() { return active; }
    public Category getCategory() { return category; }
    public Brand getBrand() { return brand; }
    public Map<String, String> getSpecifications() { return Map.copyOf(specifications); }
    public void setSku(String sku) { this.sku = sku; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setActive(boolean active) { this.active = active; }
    public void setCategory(Category category) { this.category = category; }
    public void setBrand(Brand brand) { this.brand = brand; }
    public void setSpecifications(Map<String, String> specifications) {
        this.specifications = specifications == null ? new LinkedHashMap<>() : new LinkedHashMap<>(specifications);
    }
    public void reserve(int quantity) {
        if (quantity < 1 || stockQuantity < quantity) throw new IllegalStateException("Insufficient stock for " + sku);
        stockQuantity -= quantity;
    }
    public void release(int quantity) {
        if (quantity < 1) throw new IllegalArgumentException("Quantity must be positive");
        stockQuantity += quantity;
    }
}

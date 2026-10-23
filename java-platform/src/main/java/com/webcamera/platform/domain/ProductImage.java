package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_image", schema = "camera_platform")
public class ProductImage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @Column(nullable = false, length = 1000)
    private String url;
    @Column(nullable = false, length = 255)
    private String altText = "";
    @Column(nullable = false)
    private int sortOrder;
    @Column(name = "primary_image", nullable = false)
    private boolean primary;

    protected ProductImage() {}
    public ProductImage(Product product, String url, String altText, int sortOrder, boolean primary) {
        this.product = product; this.url = url; this.altText = altText; this.sortOrder = sortOrder; this.primary = primary;
    }
    public String getUrl() { return url; }
    public String getAltText() { return altText; }
    public int getSortOrder() { return sortOrder; }
    public boolean isPrimary() { return primary; }
}

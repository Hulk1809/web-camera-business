package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "category", schema = "camera_platform")
public class Category extends BaseEntity {
    @Column(nullable = false, length = 120)
    private String name;
    @Column(nullable = false, unique = true, length = 120)
    private String slug;
    @Column(nullable = false)
    private boolean active = true;

    protected Category() {}
    public Category(String name, String slug) { this.name = name; this.slug = slug; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public boolean isActive() { return active; }
    public void update(String name, String slug, boolean active) { this.name = name; this.slug = slug; this.active = active; }
}

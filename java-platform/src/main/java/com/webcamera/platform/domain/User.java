package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_user", schema = "camera_platform")
public class User extends BaseEntity {
    public enum Role { CUSTOMER, STAFF, ADMIN }
    @Column(nullable = false, unique = true, length = 254)
    private String email;
    @Column(nullable = false, length = 100)
    private String displayName;
    @Column(nullable = false, length = 100)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.CUSTOMER;
    @Column(nullable = false)
    private boolean enabled = true;

    protected User() {}
    public User(String email, String displayName, String passwordHash, Role role) {
        this.email = email.toLowerCase();
        this.displayName = displayName;
        this.passwordHash = passwordHash;
        this.role = role;
    }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public String getPasswordHash() { return passwordHash; }
    public Role getRole() { return role; }
    public boolean isEnabled() { return enabled; }
}

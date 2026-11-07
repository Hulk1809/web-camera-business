package com.progear.catalog;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class Catalog {
    private static final String SELECT = """
            SELECT p.id, p.name, p.sku, p.price, p.description,
                   c.name AS category, b.name AS brand,
                   p.stock, p.image_url AS imageUrl,
                   p.category_id AS categoryId, p.brand_id AS brandId
            FROM product p
            JOIN category c ON c.id = p.category_id
            JOIN brand b ON b.id = p.brand_id
            WHERE p.visible AND c.visible AND b.visible
            """;
    private final JdbcClient jdbc;

    public Catalog(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public record Product(long id, String name, String sku, BigDecimal price,
                          String description, String category, String brand,
                          int stock, String imageUrl, long categoryId, long brandId) {}

    public record Option(long id, String name) {}

    public record WarrantyInfo(String serialNumber, String status, LocalDate warrantyUntil,
                               String sku, String productName, String brand) {}

    public List<Product> list(int page) {
        return list(page, null, null, null, null, false);
    }

    public List<Product> list(int page, String q, Long categoryId, Long brandId) {
        return list(page, q, categoryId, brandId, null, false);
    }

    public List<Product> list(int page, String q, Long categoryId, Long brandId, String sort, boolean inStockOnly) {
        var sql = new StringBuilder(SELECT);
        Map<String, Object> params = new HashMap<>();
        if (q != null && !q.isBlank()) {
            sql.append(" AND (LOWER(p.name) LIKE :q OR LOWER(p.sku) LIKE :q OR LOWER(p.description) LIKE :q)");
            params.put("q", "%" + q.trim().toLowerCase() + "%");
        }
        if (categoryId != null && categoryId > 0) {
            sql.append(" AND p.category_id = :categoryId");
            params.put("categoryId", categoryId);
        }
        if (brandId != null && brandId > 0) {
            sql.append(" AND p.brand_id = :brandId");
            params.put("brandId", brandId);
        }
        if (inStockOnly) {
            sql.append(" AND p.stock > 0");
        }
        String orderBy = switch (sort == null ? "" : sort) {
            case "price_asc" -> " ORDER BY p.price ASC, p.id ASC";
            case "price_desc" -> " ORDER BY p.price DESC, p.id ASC";
            case "newest" -> " ORDER BY p.id DESC";
            default -> " ORDER BY p.id ASC";
        };
        sql.append(orderBy).append(" LIMIT 51 OFFSET :offset");
        params.put("offset", (long) page * 50);

        var stmt = jdbc.sql(sql.toString());
        for (var entry : params.entrySet()) {
            stmt = stmt.param(entry.getKey(), entry.getValue());
        }
        return stmt.query(Product.class).list();
    }

    public Optional<Product> find(long id) {
        return jdbc.sql(SELECT + " AND p.id = :id").param("id", id).query(Product.class).optional();
    }

    public List<Product> related(long productId, long categoryId) {
        return jdbc.sql(SELECT + " AND p.id <> :id ORDER BY (p.category_id = :cid) DESC, p.id ASC LIMIT 4")
                .param("id", productId)
                .param("cid", categoryId)
                .query(Product.class)
                .list();
    }

    public List<Option> categories() {
        return jdbc.sql("SELECT id, name FROM category WHERE visible ORDER BY name")
                .query(Option.class).list();
    }

    public List<Option> brands() {
        return jdbc.sql("SELECT id, name FROM brand WHERE visible ORDER BY name")
                .query(Option.class).list();
    }

    public Optional<WarrantyInfo> findWarranty(String serial) {
        if (serial == null || serial.isBlank()) {
            return Optional.empty();
        }
        return jdbc.sql("""
                        SELECT s.serial_number AS serialNumber, s.status, s.warranty_until AS warrantyUntil,
                               p.sku, p.name AS productName, b.name AS brand
                        FROM serial_unit s
                        JOIN product p ON p.id = s.product_id
                        JOIN brand b ON b.id = p.brand_id
                        WHERE UPPER(s.serial_number) = UPPER(btrim(:serial))
                        """)
                .param("serial", serial)
                .query(WarrantyInfo.class)
                .optional();
    }
}

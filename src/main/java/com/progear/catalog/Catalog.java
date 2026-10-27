package com.progear.catalog;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class Catalog {
    private static final String SELECT = """
            SELECT p.id, p.name, p.sku, p.price, p.description,
                   c.name AS category, b.name AS brand
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
                          String description, String category, String brand) {}

    public List<Product> list(int page) {
        return jdbc.sql(SELECT + " ORDER BY p.id LIMIT 51 OFFSET :offset")
                .param("offset", (long) page * 50).query(Product.class).list();
    }

    public Optional<Product> find(long id) {
        return jdbc.sql(SELECT + " AND p.id = :id").param("id", id).query(Product.class).optional();
    }
}

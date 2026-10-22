package com.webcamera.platform.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.webcamera.platform.domain.Product;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

@DataJpaTest(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=jdbc:h2:mem:camera;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform"
})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ProductRepositoryTest {
    @Autowired ProductRepository products;

    @Test
    void returnsOnlyActiveProductsInNameOrder() {
        Product zulu = new Product("Z-1", "Zulu", BigDecimal.ONE, 1);
        Product alpha = new Product("A-1", "Alpha", BigDecimal.TEN, 2);
        Product hidden = new Product("H-1", "Hidden", BigDecimal.TEN, 2);
        hidden.setActive(false);
        products.save(zulu);
        products.save(alpha);
        products.save(hidden);

        assertThat(products.findByActiveTrueOrderByNameAsc())
                .extracting(Product::getName)
                .containsExactly("Alpha", "Zulu");
    }
}

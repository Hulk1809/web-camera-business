package com.webcamera.platform.config;

import static org.assertj.core.api.Assertions.assertThat;

import com.webcamera.platform.repository.BrandRepository;
import com.webcamera.platform.repository.CategoryRepository;
import com.webcamera.platform.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=jdbc:h2:mem:retail_bootstrap;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform",
        "app.bootstrap-admin.enabled=false",
        "app.bootstrap-sample-catalog.enabled=true",
        "app.bank-transfer.account-number=0000000000",
        "app.bank-transfer.account-name=TEST ACCOUNT"
})
class RetailCatalogBootstrapTest {
    @Autowired
    private ProductRepository products;
    @Autowired
    private CategoryRepository categories;
    @Autowired
    private BrandRepository brands;

    @Test
    void seedsRetailCatalogWithoutRequiringAdminBootstrap() {
        assertThat(products.findBySkuIgnoreCase("ILME-FX3-BODY")).isPresent();
        assertThat(products.findBySkuIgnoreCase("DJI-MAVIC3-PRO-CINE")).isPresent();
        assertThat(products.count()).isEqualTo(12);
        assertThat(categories.count()).isEqualTo(7);
        assertThat(brands.count()).isEqualTo(6);
    }
}

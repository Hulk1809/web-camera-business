package com.progear;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.dao.DataIntegrityViolationException;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Testcontainers
@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PlatformIntegrationTest {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:16-alpine");

    @Autowired
    private JdbcClient jdbcClient;

    @Autowired
    private TestRestTemplate rest;

    @Test
    void contextLoadsAndFlywayVersionOneSucceeded() {
        Boolean success = jdbcClient.sql("""
                        SELECT success
                        FROM flyway_schema_history
                        WHERE version = '1'
                        """)
                .query(Boolean.class)
                .single();

        assertThat(success).isTrue();
    }

    @Test
    void anonymousHealthIsUp() {
        ResponseEntity<String> response = rest.getForEntity("/actuator/health", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("\"status\":\"UP\"");
    }

    @Test
    void anonymousRootIsProtected() {
        ResponseEntity<String> response = rest.getForEntity("/", String.class);

        assertThat(response.getStatusCode().is3xxRedirection()
                || response.getStatusCode() == HttpStatus.UNAUTHORIZED
                || response.getStatusCode() == HttpStatus.FORBIDDEN).isTrue();
    }

    @Test
    @Sql(statements = {
            "INSERT INTO category (name, visible) VALUES ('Camera', true), ('Hidden category', false)",
            "INSERT INTO brand (name, visible) VALUES ('Brand', true), ('Hidden brand', false)",
            """
            INSERT INTO product (category_id, brand_id, name, sku, price, description, visible)
            SELECT c.id, b.id, 'Camera <script>alert(1)</script>', 'CAM-1', 123.45, '<img src=x onerror=alert(1)>', true
            FROM category c, brand b WHERE c.name = 'Camera' AND b.name = 'Brand'
            """,
            """
            INSERT INTO product (category_id, brand_id, name, sku, price, visible)
            SELECT c.id, b.id, 'Secret product', 'HIDDEN', 10, false
            FROM category c, brand b WHERE c.name = 'Camera' AND b.name = 'Brand'
            """,
            """
            INSERT INTO product (category_id, brand_id, name, sku, price, visible)
            SELECT c.id, b.id, 'Hidden parent product', 'PARENT', 10, true
            FROM category c, brand b WHERE c.name = 'Hidden category' AND b.name = 'Hidden brand'
            """
    })
    @Sql(statements = "TRUNCATE product, category, brand RESTART IDENTITY", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    void catalogIsPublicAndDoesNotLeakHiddenProductsOrRenderHtml() {
        assertThat(jdbcClient.sql("SELECT success FROM flyway_schema_history WHERE version = '2'")
                .query(Boolean.class).single()).isTrue();
        var list = rest.getForEntity("/products", String.class);
        assertThat(list.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(list.getBody()).contains("123.45 VND", "&lt;script&gt;")
                .doesNotContain("Secret product", "Hidden parent product", "<script>");
        long id = jdbcClient.sql("SELECT id FROM product WHERE sku = 'CAM-1'").query(Long.class).single();
        var detail = rest.getForEntity("/products/" + id, String.class);
        assertThat(detail.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(detail.getBody()).contains("CAM-1", "123.45 VND", "&lt;img", "Camera", "Brand")
                .doesNotContain("<img", "<script>");
        for (long hiddenId : jdbcClient.sql("SELECT id FROM product WHERE sku <> 'CAM-1'").query(Long.class).list()) {
            assertThat(rest.getForEntity("/products/" + hiddenId, String.class).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        }
        assertThat(rest.getForEntity("/products/999999", String.class).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(rest.getForEntity("/products/not-a-number", String.class).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(rest.getForEntity("/products?page=-1", String.class).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(rest.getForEntity("/products?page=1", String.class).getBody()).contains("Chưa có sản phẩm");
        assertThat(rest.postForEntity("/products", "", String.class).getStatusCode().is4xxClientError()).isTrue();
        assertThatThrownBy(() -> jdbcClient.sql("UPDATE product SET price = -1 WHERE id = :id").param("id", id).update())
                .isInstanceOf(DataIntegrityViolationException.class);
        assertThatThrownBy(() -> jdbcClient.sql("UPDATE product SET sku = 'CAM-1' WHERE sku = 'HIDDEN'").update())
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}

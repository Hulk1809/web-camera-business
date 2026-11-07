package com.progear;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.http.client.HttpRedirects;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@Testcontainers
@AutoConfigureTestRestTemplate
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PlatformIntegrationTest {

    private static final Pattern CSRF_PATTERN = Pattern.compile("name=\"_csrf\" value=\"([^\"]+)\"");

    @Container
    @ServiceConnection
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:16-alpine");

    @Autowired
    private JdbcClient jdbcClient;

    @Autowired
    private TestRestTemplate rest;

    @Test
    void contextLoadsAndFlywayVersionOneSucceeded() {
        for (String version : List.of("1", "2", "3", "4")) {
            Boolean success = jdbcClient.sql("SELECT success FROM flyway_schema_history WHERE version = :v")
                    .param("v", version)
                    .query(Boolean.class)
                    .single();
            assertThat(success).isTrue();
        }
        Long seededUsers = jdbcClient.sql("SELECT COUNT(*) FROM app_user").query(Long.class).single();
        assertThat(seededUsers).isGreaterThanOrEqualTo(3L);
    }

    @Test
    void anonymousHealthIsUp() {
        ResponseEntity<String> response = rest.getForEntity("/actuator/health", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("\"status\":\"UP\"");
    }

    @Test
    void anonymousRootIsProtected() {
        ResponseEntity<String> response = rest.withRedirects(HttpRedirects.DONT_FOLLOW)
                .getForEntity("/", String.class);

        assertThat(response.getStatusCode().is3xxRedirection()
                || response.getStatusCode() == HttpStatus.UNAUTHORIZED
                || response.getStatusCode() == HttpStatus.FORBIDDEN).isTrue();
    }

    @Test
    @Sql(statements = {
            "TRUNCATE product, category, brand RESTART IDENTITY CASCADE",
            "INSERT INTO category (name, visible) VALUES ('Camera', true), ('Hidden category', false)",
            "INSERT INTO brand (name, visible) VALUES ('Brand', true), ('Hidden brand', false)",
            """
            INSERT INTO product (category_id, brand_id, name, sku, price, description, visible)
            SELECT c.id, b.id, 'Camera <script>alert(1)</script>', 'CAM-1', 123.45, '<img src=x onerror=alert(1)>', true
            FROM category c, brand b WHERE c.name = 'Camera' AND b.name = 'Brand';
            """,
            """
            INSERT INTO product (category_id, brand_id, name, sku, price, visible)
            SELECT c.id, b.id, 'Secret product', 'HIDDEN', 10, false
            FROM category c, brand b WHERE c.name = 'Camera' AND b.name = 'Brand';
            """,
            """
            INSERT INTO product (category_id, brand_id, name, sku, price, visible)
            SELECT c.id, b.id, 'Hidden category product', 'HIDDEN-CAT', 10, true
            FROM category c, brand b WHERE c.name = 'Hidden category' AND b.name = 'Brand';
            """,
            """
            INSERT INTO product (category_id, brand_id, name, sku, price, visible)
            SELECT c.id, b.id, 'Hidden brand product', 'HIDDEN-BRAND', 10, true
            FROM category c, brand b WHERE c.name = 'Camera' AND b.name = 'Hidden brand';
            """
    })
    @Sql(statements = "TRUNCATE product, category, brand RESTART IDENTITY CASCADE", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    @Sql(scripts = "/db/migration/V3__initial_catalog_items.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
    void catalogIsPublicAndDoesNotLeakHiddenProductsOrRenderHtml() {
        assertThat(jdbcClient.sql("SELECT success FROM flyway_schema_history WHERE version = '2'")
                .query(Boolean.class).single()).isTrue();
        var list = rest.getForEntity("/products", String.class);
        assertThat(list.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(list.getBody()).contains("<h1>Máy ảnh và phụ kiện</h1>", "123.45 VND", "&lt;script&gt;")
                .doesNotContain("Secret product", "Hidden category product", "Hidden brand product", "HIDDEN", "HIDDEN-CAT", "HIDDEN-BRAND", "<script>");
        long id = jdbcClient.sql("SELECT id FROM product WHERE sku = 'CAM-1'").query(Long.class).single();
        long catId = jdbcClient.sql("SELECT id FROM category WHERE name = 'Camera'").query(Long.class).single();
        long brandId = jdbcClient.sql("SELECT id FROM brand WHERE name = 'Brand'").query(Long.class).single();

        var filtered = rest.getForEntity("/products?q=CAM-1&categoryId=" + catId + "&brandId=" + brandId, String.class);
        assertThat(filtered.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(filtered.getBody()).contains("CAM-1", "123.45 VND");

        var noMatch = rest.getForEntity("/products?q=NONEXISTENT-SKU-999", String.class);
        assertThat(noMatch.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(noMatch.getBody()).contains("Chưa có sản phẩm");

        var detail = rest.getForEntity("/products/" + id, String.class);
        assertThat(detail.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(detail.getBody()).contains("CAM-1", "123.45 VND", "&lt;img", "Camera", "Brand")
                .doesNotContain("<img", "<script>");
        for (long hiddenId : jdbcClient.sql("SELECT id FROM product WHERE sku <> 'CAM-1'").query(Long.class).list()) {
            var hiddenDetail = rest.getForEntity("/products/" + hiddenId, String.class);
            assertThat(hiddenDetail.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
            assertThat(hiddenDetail.getBody()).doesNotContain("Secret product", "Hidden category product", "Hidden brand product", "HIDDEN", "HIDDEN-CAT", "HIDDEN-BRAND");
        }
        assertThat(rest.getForEntity("/products/999999", String.class).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(rest.getForEntity("/products/not-a-number", String.class).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(rest.getForEntity("/products?page=-1", String.class).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(rest.getForEntity("/products?page=1", String.class).getBody()).contains("Chưa có sản phẩm");
        var errorResponse = rest.withRedirects(HttpRedirects.DONT_FOLLOW).getForEntity("/error", String.class);
        assertThat(errorResponse.getStatusCode().is3xxRedirection()
                || errorResponse.getStatusCode() == HttpStatus.UNAUTHORIZED
                || errorResponse.getStatusCode() == HttpStatus.FORBIDDEN).isTrue();
        assertThat(rest.postForEntity("/products", "", String.class).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThatThrownBy(() -> jdbcClient.sql("UPDATE product SET price = -1 WHERE id = :id").param("id", id).update())
                .isInstanceOf(DataIntegrityViolationException.class);
        assertThatThrownBy(() -> jdbcClient.sql("UPDATE product SET sku = 'CAM-1' WHERE sku = 'HIDDEN'").update())
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void authRegistrationCsrfAndRbacEnforcement() {
        // 1. POST /register without CSRF must be rejected with 403 FORBIDDEN
        var noCsrfForm = new LinkedMultiValueMap<String, String>();
        noCsrfForm.add("email", "nocsrf@progear.vn");
        noCsrfForm.add("password", "Secret@123");
        noCsrfForm.add("fullName", "No CSRF User");
        assertThat(rest.postForEntity("/register", noCsrfForm, String.class).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);

        // 2. Register new customer with valid CSRF token
        var regForm = new LinkedMultiValueMap<String, String>();
        regForm.add("email", "newbuyer@progear.vn");
        regForm.add("password", "Buyer@123456");
        regForm.add("fullName", "Trần Nhiếp Ảnh");
        regForm.add("address", "88 Đồng Khởi, Q1, TP.HCM");
        var regResp = postWithCsrf("/register", null, regForm);
        assertThat(regResp.getStatusCode()).isEqualTo(HttpStatus.FOUND);
        assertThat(regResp.getHeaders().getLocation().toString()).contains("/login?registered=1");

        // 3. Login as registered customer and verify RBAC
        String customerCookie = login("newbuyer@progear.vn", "Buyer@123456");
        assertThat(getWithCookie("/profile", customerCookie).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getWithCookie("/admin", customerCookie).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(getWithCookie("/pos", customerCookie).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        // 4. Login as staff and verify RBAC
        String staffCookie = login("staff@progear.vn", "Staff@123456");
        assertThat(getWithCookie("/pos", staffCookie).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getWithCookie("/admin", staffCookie).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        // 5. Login as admin and verify RBAC
        String adminCookie = login("admin@progear.vn", "Admin@123456");
        assertThat(getWithCookie("/admin", adminCookie).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(getWithCookie("/pos", adminCookie).getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void adminCrudAndAuditLog() {
        String adminCookie = login("admin@progear.vn", "Admin@123456");

        var catForm = new LinkedMultiValueMap<String, String>();
        catForm.add("name", "Máy quay Cinema");
        catForm.add("visible", "true");
        assertThat(postWithCsrf("/admin/categories", adminCookie, catForm).getStatusCode()).isEqualTo(HttpStatus.FOUND);

        var brandForm = new LinkedMultiValueMap<String, String>();
        brandForm.add("name", "RED Digital");
        brandForm.add("visible", "true");
        assertThat(postWithCsrf("/admin/brands", adminCookie, brandForm).getStatusCode()).isEqualTo(HttpStatus.FOUND);

        long catId = jdbcClient.sql("SELECT id FROM category WHERE name = 'Máy quay Cinema'").query(Long.class).single();
        long brandId = jdbcClient.sql("SELECT id FROM brand WHERE name = 'RED Digital'").query(Long.class).single();

        var prodForm = new LinkedMultiValueMap<String, String>();
        prodForm.add("categoryId", String.valueOf(catId));
        prodForm.add("brandId", String.valueOf(brandId));
        prodForm.add("name", "RED Komodo-X 6K");
        prodForm.add("sku", "RED-KOMODO-X");
        prodForm.add("price", "215000000.00");
        prodForm.add("stock", "4");
        prodForm.add("description", "Global Shutter 6K S35 Cinema Camera");
        prodForm.add("visible", "true");
        assertThat(postWithCsrf("/admin/products", adminCookie, prodForm).getStatusCode()).isEqualTo(HttpStatus.FOUND);

        Integer stock = jdbcClient.sql("SELECT stock FROM product WHERE sku = 'RED-KOMODO-X'").query(Integer.class).single();
        assertThat(stock).isEqualTo(4);

        Long auditCount = jdbcClient.sql("SELECT COUNT(*) FROM audit_log WHERE actor = 'admin@progear.vn' AND action = 'PRODUCT_UPSERT'")
                .query(Long.class).single();
        assertThat(auditCount).isGreaterThanOrEqualTo(1L);
    }

    @Test
    void atomicCheckoutConcurrencyIdempotencyPriceSnapshotIdorAndSingleCancelRestore() throws Exception {
        // Ensure category, brand, and test product exist with stock = 3
        long catId = jdbcClient.sql("INSERT INTO category (name, visible) VALUES ('Mirrorless Test', true) RETURNING id").query(Long.class).single();
        long brandId = jdbcClient.sql("INSERT INTO brand (name, visible) VALUES ('Sony Test', true) RETURNING id").query(Long.class).single();
        long prodId = jdbcClient.sql("""
                        INSERT INTO product (category_id, brand_id, name, sku, price, stock, description, visible)
                        VALUES (:c, :b, 'Sony A9 III Body', 'SONY-A9M3-TEST', 139990000.00, 3, 'Global shutter', true)
                        RETURNING id
                        """)
                .param("c", catId)
                .param("b", brandId)
                .query(Long.class)
                .single();

        String customerCookie = login("customer@progear.vn", "Customer@123456");

        // 1. Concurrent checkout test: 8 concurrent requests for stock = 3
        int threads = 8;
        var pool = Executors.newFixedThreadPool(threads);
        List<Callable<HttpStatus>> tasks = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            final String idemKey = "CONC-KEY-" + UUID.randomUUID();
            tasks.add(() -> {
                var form = new LinkedMultiValueMap<String, String>();
                form.add("idempotencyKey", idemKey);
                form.add("paymentMethod", "COD");
                form.add("shippingAddress", "123 Lê Lợi, Q1");
                form.add("productId", String.valueOf(prodId));
                form.add("quantity", "1");
                return HttpStatus.valueOf(postWithCsrf("/checkout", customerCookie, form).getStatusCode().value());
            });
        }
        var results = pool.invokeAll(tasks);
        pool.shutdown();

        int successCount = 0;
        int conflictCount = 0;
        for (var f : results) {
            HttpStatus st = f.get();
            if (st == HttpStatus.FOUND) successCount++;
            else if (st == HttpStatus.CONFLICT) conflictCount++;
        }
        assertThat(successCount).isEqualTo(3);
        assertThat(conflictCount).isEqualTo(5);

        Integer remainingStock = jdbcClient.sql("SELECT stock FROM product WHERE id = :id").param("id", prodId).query(Integer.class).single();
        assertThat(remainingStock).isZero();

        // 2. Idempotency-Key deduplication test
        jdbcClient.sql("UPDATE product SET stock = 5 WHERE id = :id").param("id", prodId).update();
        String duplicateKey = "IDEM-DEDUP-" + UUID.randomUUID();
        var idemForm = new LinkedMultiValueMap<String, String>();
        idemForm.add("idempotencyKey", duplicateKey);
        idemForm.add("paymentMethod", "BANK_TRANSFER");
        idemForm.add("shippingAddress", "45 Nguyễn Huệ, Q1");
        idemForm.add("productId", String.valueOf(prodId));
        idemForm.add("quantity", "1");

        var firstCheckout = postWithCsrf("/checkout", customerCookie, idemForm);
        var secondCheckout = postWithCsrf("/checkout", customerCookie, idemForm);
        assertThat(firstCheckout.getStatusCode()).isEqualTo(HttpStatus.FOUND);
        assertThat(secondCheckout.getStatusCode()).isEqualTo(HttpStatus.FOUND);
        assertThat(firstCheckout.getHeaders().getLocation()).isEqualTo(secondCheckout.getHeaders().getLocation());

        Integer stockAfterIdem = jdbcClient.sql("SELECT stock FROM product WHERE id = :id").param("id", prodId).query(Integer.class).single();
        assertThat(stockAfterIdem).isEqualTo(4);

        String orderPath = firstCheckout.getHeaders().getLocation().getPath();
        long orderId = Long.parseLong(orderPath.substring(orderPath.lastIndexOf('/') + 1));

        // 3. BigDecimal price snapshot immutability test
        jdbcClient.sql("UPDATE product SET price = 199990000.00 WHERE id = :id").param("id", prodId).update();
        var orderPage = getWithCookie(orderPath, customerCookie);
        assertThat(orderPage.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(orderPage.getBody()).contains("139990000.00 VND");
        BigDecimal snapshotPrice = jdbcClient.sql("SELECT unit_price FROM order_item WHERE order_id = :oid")
                .param("oid", orderId).query(BigDecimal.class).single();
        assertThat(snapshotPrice).isEqualByComparingTo(new BigDecimal("139990000.00"));

        // 4. IDOR protection test: another customer cannot view or cancel this order
        var otherReg = new LinkedMultiValueMap<String, String>();
        otherReg.add("email", "otherbuyer@progear.vn");
        otherReg.add("password", "Other@123456");
        otherReg.add("fullName", "Khách Hàng Khác");
        postWithCsrf("/register", null, otherReg);
        String otherCookie = login("otherbuyer@progear.vn", "Other@123456");

        assertThat(getWithCookie(orderPath, otherCookie).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(postWithCsrf(orderPath + "/cancel", otherCookie, new LinkedMultiValueMap<>()).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);

        // 5. Single-time stock restoration on cancel (calling cancel twice restores stock only once)
        assertThat(postWithCsrf(orderPath + "/cancel", customerCookie, new LinkedMultiValueMap<>()).getStatusCode())
                .isEqualTo(HttpStatus.FOUND);
        assertThat(jdbcClient.sql("SELECT stock FROM product WHERE id = :id").param("id", prodId).query(Integer.class).single())
                .isEqualTo(5);

        assertThat(postWithCsrf(orderPath + "/cancel", customerCookie, new LinkedMultiValueMap<>()).getStatusCode())
                .isEqualTo(HttpStatus.FOUND);
        assertThat(jdbcClient.sql("SELECT stock FROM product WHERE id = :id").param("id", prodId).query(Integer.class).single())
                .isEqualTo(5);

        // 6. Session cart flow (/cart/add -> /cart -> /checkout)
        var addCartForm = new LinkedMultiValueMap<String, String>();
        addCartForm.add("productId", String.valueOf(prodId));
        addCartForm.add("quantity", "1");
        assertThat(postWithCsrf("/cart/add", customerCookie, addCartForm).getStatusCode()).isEqualTo(HttpStatus.FOUND);
        var cartView = getWithCookie("/cart", customerCookie);
        assertThat(cartView.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(cartView.getBody()).contains("SONY-A9M3-TEST", "199990000.00 VND");
        var sessionCheckoutForm = new LinkedMultiValueMap<String, String>();
        sessionCheckoutForm.add("idempotencyKey", "SESSION-CART-" + UUID.randomUUID());
        sessionCheckoutForm.add("paymentMethod", "COD");
        sessionCheckoutForm.add("shippingAddress", "99 Nguyễn Huệ, Q1");
        assertThat(postWithCsrf("/checkout", customerCookie, sessionCheckoutForm).getStatusCode()).isEqualTo(HttpStatus.FOUND);
        assertThat(jdbcClient.sql("SELECT stock FROM product WHERE id = :id").param("id", prodId).query(Integer.class).single())
                .isEqualTo(4);
    }

    @Test
    void posCounterAtomicSaleWithSerialAndPublicWarrantyLookup() {
        long catId = jdbcClient.sql("INSERT INTO category (name, visible) VALUES ('POS Category', true) RETURNING id").query(Long.class).single();
        long brandId = jdbcClient.sql("INSERT INTO brand (name, visible) VALUES ('POS Brand', true) RETURNING id").query(Long.class).single();
        long prodId = jdbcClient.sql("""
                        INSERT INTO product (category_id, brand_id, name, sku, price, stock, description, visible)
                        VALUES (:c, :b, 'Canon RF 50mm f/1.2L USM', 'CANON-RF-50-12', 56990000.00, 5, 'Ống kính L USM', true)
                        RETURNING id
                        """)
                .param("c", catId)
                .param("b", brandId)
                .query(Long.class)
                .single();
        jdbcClient.sql("""
                        INSERT INTO serial_unit (product_id, serial_number, status, warranty_until)
                        VALUES (:p, 'SN-POS-RF50-001', 'IN_STOCK', NULL),
                               (:p, 'SN-DEMO-WARRANTY-2027', 'SOLD', DATE '2027-12-31')
                        ON CONFLICT (serial_number) DO NOTHING
                        """)
                .param("p", prodId)
                .update();

        // Public warranty lookup for pre-seeded demo serial
        var demoWarranty = rest.getForEntity("/warranty?serial=SN-DEMO-WARRANTY-2027", String.class);
        assertThat(demoWarranty.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(demoWarranty.getBody()).contains("SN-DEMO-WARRANTY-2027", "SOLD", "2027-12-31");

        // Staff executes POS sale with serial assignment
        String staffCookie = login("staff@progear.vn", "Staff@123456");
        var posForm = new LinkedMultiValueMap<String, String>();
        posForm.add("sku", "CANON-RF-50-12");
        posForm.add("quantity", "1");
        posForm.add("serialNumber", "SN-POS-RF50-001");
        posForm.add("paymentMethod", "CARD");
        posForm.add("idempotencyKey", "POS-KEY-" + UUID.randomUUID());

        var posResp = postWithCsrf("/pos/orders", staffCookie, posForm);
        assertThat(posResp.getStatusCode()).isEqualTo(HttpStatus.FOUND);

        Integer stockAfterPos = jdbcClient.sql("SELECT stock FROM product WHERE id = :id").param("id", prodId).query(Integer.class).single();
        assertThat(stockAfterPos).isEqualTo(4);

        var warrantyPage = rest.getForEntity("/warranty?serial=SN-POS-RF50-001", String.class);
        assertThat(warrantyPage.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(warrantyPage.getBody()).contains("SN-POS-RF50-001", "CANON-RF-50-12", "SOLD", LocalDate.now().plusDays(365).toString());
    }

    private String login(String email, String password) {
        var loginPage = rest.withRedirects(HttpRedirects.DONT_FOLLOW).getForEntity("/login", String.class);
        String cookie = extractSessionCookie(loginPage.getHeaders(), null);
        String csrf = extractCsrf(loginPage.getBody());

        var form = new LinkedMultiValueMap<String, String>();
        form.add("username", email);
        form.add("password", password);
        form.add("_csrf", csrf);

        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        if (cookie != null) headers.set(HttpHeaders.COOKIE, cookie);

        var resp = rest.withRedirects(HttpRedirects.DONT_FOLLOW)
                .postForEntity("/login", new HttpEntity<>(form, headers), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.FOUND);
        assertThat(resp.getHeaders().getLocation().toString()).doesNotContain("error");
        String sessionCookie = extractSessionCookie(resp.getHeaders(), cookie);
        // Eagerly initialize CSRF token in the post-login session so concurrent requests never race on token creation
        extractCsrf(getWithCookie("/login", sessionCookie).getBody());
        return sessionCookie;
    }

    private ResponseEntity<String> getWithCookie(String path, String cookie) {
        var headers = new HttpHeaders();
        if (cookie != null) headers.set(HttpHeaders.COOKIE, cookie);
        return rest.withRedirects(HttpRedirects.DONT_FOLLOW)
                .exchange(path, HttpMethod.GET, new HttpEntity<>(headers), String.class);
    }

    private ResponseEntity<String> postWithCsrf(String path, String cookie, MultiValueMap<String, String> form) {
        var page = getWithCookie("/login", cookie);
        String activeCookie = extractSessionCookie(page.getHeaders(), cookie);
        String csrf = extractCsrf(page.getBody());

        var payload = new LinkedMultiValueMap<>(form);
        payload.set("_csrf", csrf);

        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        if (activeCookie != null) headers.set(HttpHeaders.COOKIE, activeCookie);

        return rest.withRedirects(HttpRedirects.DONT_FOLLOW)
                .postForEntity(path, new HttpEntity<>(payload, headers), String.class);
    }

    private static String extractCsrf(String html) {
        assertThat(html).isNotNull();
        Matcher m = CSRF_PATTERN.matcher(html);
        assertThat(m.find()).as("CSRF input present in HTML").isTrue();
        return m.group(1);
    }

    private static String extractSessionCookie(HttpHeaders headers, String fallback) {
        List<String> setCookies = headers.get(HttpHeaders.SET_COOKIE);
        if (setCookies != null) {
            for (String sc : setCookies) {
                if (sc.startsWith("JSESSIONID=")) {
                    return sc.split(";", 2)[0];
                }
            }
        }
        return fallback;
    }
}

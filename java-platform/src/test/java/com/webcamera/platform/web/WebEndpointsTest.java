package com.webcamera.platform.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.webcamera.platform.service.InventoryService;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=jdbc:h2:mem:web_endpoints;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform",
        "app.bank-transfer.account-number=0000000000",
        "app.bank-transfer.account-name=TEST ACCOUNT"
})
@AutoConfigureMockMvc
class WebEndpointsTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private InventoryService inventory;
    @Autowired private OrderService orders;
    @Autowired private UserRepository users;
    @Autowired private ProductRepository products;

    @Test
    void missingApiRouteReturns404NotRedirect() throws Exception {
        mvc.perform(get("/api/qa-definitely-missing-route"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    void unknownWarrantyLookupReturns404NotRedirect() throws Exception {
        mvc.perform(get("/api/warranty/QA-READONLY-NOT-FOUND-0000000000"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("QA-READONLY-NOT-FOUND-0000000000")));
    }

    @Test
    void healthEndpointReturnsUp() throws Exception {
        mvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void authenticatedApiReturns401NotRedirect() throws Exception {
        mvc.perform(get("/api/orders"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Transactional
    @WithMockUser(username = "api-owner@example.com", roles = "CUSTOMER")
    void customerCanReadAndCancelOwnOrder() throws Exception {
        User owner = users.save(new User("api-owner@example.com", "API Owner", "hash", User.Role.CUSTOMER));
        Product product = products.save(new Product("API-OWNER-CAM", "Camera", BigDecimal.TEN, 1));
        var order = orders.place(owner.getId(), List.of(new OrderService.Line(product.getId(), 1)));

        mvc.perform(get("/api/orders/mine/{orderNumber}", order.getOrderNumber()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderNumber").value(order.getOrderNumber()));
        mvc.perform(post("/api/orders/mine/{orderNumber}/cancel", order.getOrderNumber())
                        .with(csrf()).contentType("application/json").content("{\"reason\":\"Đổi nhu cầu\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @Transactional
    @WithMockUser(username = "api-stranger@example.com", roles = "CUSTOMER")
    void customerCannotReadAnotherCustomersOrder() throws Exception {
        User owner = users.save(new User("api-real-owner@example.com", "Real Owner", "hash", User.Role.CUSTOMER));
        users.save(new User("api-stranger@example.com", "API Stranger", "hash", User.Role.CUSTOMER));
        Product product = products.save(new Product("API-IDOR-CAM", "Camera", BigDecimal.TEN, 1));
        var order = orders.place(owner.getId(), List.of(new OrderService.Line(product.getId(), 1)));

        mvc.perform(get("/api/orders/mine/{orderNumber}", order.getOrderNumber()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Không tìm thấy đơn hàng"));
    }

    @Test
    @Transactional
    @WithMockUser(username = "checkout-owner@example.com", roles = "CUSTOMER")
    void checkoutRequiresKeyAndRejectsKeyReuseWithDifferentPayload() throws Exception {
        users.save(new User("checkout-owner@example.com", "Checkout Owner", "hash", User.Role.CUSTOMER));
        Product product = products.save(new Product("API-IDEMPOTENCY", "Camera", BigDecimal.TEN, 3));
        String oneItem = """
                {"lines":[{"productId":"%s","quantity":1}],"delivery":{"recipientName":"QA","email":"checkout-owner@example.com","phone":"0900000000","address":"QA address","paymentMethod":"COD"}}
                """.formatted(product.getId());
        String twoItems = oneItem.replace("\"quantity\":1", "\"quantity\":2");

        mvc.perform(post("/api/orders").with(csrf()).contentType("application/json").content(oneItem))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/api/orders").with(csrf()).header("Idempotency-Key", "api-checkout-1")
                        .contentType("application/json").content(oneItem))
                .andExpect(status().isCreated());
        mvc.perform(post("/api/orders").with(csrf()).header("Idempotency-Key", "api-checkout-1")
                        .contentType("application/json").content(twoItems))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Idempotency key was already used for another checkout"));
    }
}

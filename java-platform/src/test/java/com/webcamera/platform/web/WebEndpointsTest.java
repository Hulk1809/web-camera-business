package com.webcamera.platform.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.webcamera.platform.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

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
}

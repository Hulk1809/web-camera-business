package com.webcamera.platform.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=jdbc:h2:mem:qa_fixture_endpoint;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform",
        "app.qa-fixtures.enabled=true",
        "app.qa-fixtures.token=0123456789abcdef0123456789abcdef",
        "app.bank-transfer.account-number=0000000000",
        "app.bank-transfer.account-name=TEST ACCOUNT"
})
@AutoConfigureMockMvc
@Transactional
class QaFixtureEndpointIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    void bearerTokenAllowsLifecycleWithoutBrowserCsrfToken() throws Exception {
        mvc.perform(post("/qa/fixtures")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer invalid")
                        .contentType("application/json")
                        .content("{\"scenario\":\"order-readback\",\"ttlSeconds\":300}"))
                .andExpect(status().isUnauthorized());

        String body = mvc.perform(post("/qa/fixtures")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer 0123456789abcdef0123456789abcdef")
                        .contentType("application/json")
                        .content("{\"scenario\":\"order-readback\",\"ttlSeconds\":300}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("READY"))
                .andExpect(jsonPath("$.productSku").value(org.hamcrest.Matchers.startsWith("QA-FIXTURE-")))
                .andReturn().getResponse().getContentAsString();
        JsonNode created = objectMapper.readTree(body);

        mvc.perform(delete("/qa/fixtures/{id}", created.get("id").asText())
                        .header(HttpHeaders.AUTHORIZATION, "Bearer 0123456789abcdef0123456789abcdef"))
                .andExpect(status().isNoContent());
    }
}

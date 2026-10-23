package vn.progear.qa.layer4;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import vn.progear.qa.support.QaConfig;

import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

@Tag("layer4")
@Tag("writes")
class FixtureApiWriteLifecycleTest {
    @Test
    void fixtureServiceOwnsCreateVerifyAndCleanupLifecycle() {
        assumeTrue(QaConfig.writesEnabled(),
                "Requires QA_ALLOW_WRITES=true, QA_FIXTURE_API_URL and QA_FIXTURE_API_TOKEN");
        URI fixtureApi = QaConfig.fixtureApiUri().orElseThrow();
        String token = QaConfig.fixtureToken().orElseThrow();

        Response create = RestAssured.given().baseUri(fixtureApi.toString())
                .header("Authorization", "Bearer " + token)
                .contentType("application/json")
                .body("{\"scenario\":\"order-readback\",\"ttlSeconds\":300}")
                .post("/qa/fixtures");
        assertEquals(201, create.statusCode(), create.asString());
        String fixtureId = create.jsonPath().getString("id");
        assertNotNull(fixtureId, "Fixture service did not return id");
        assertTrue(create.jsonPath().getString("productSku").startsWith("QA-FIXTURE-"));
        assertEquals("PENDING_PAYMENT", create.jsonPath().getString("orderStatus"));

        try {
            Response verify = RestAssured.given().baseUri(fixtureApi.toString())
                    .header("Authorization", "Bearer " + token)
                    .get("/qa/fixtures/{id}", fixtureId);
            assertEquals(200, verify.statusCode(), verify.asString());
            assertEquals("READY", verify.jsonPath().getString("status"));

            List<String> expectedStatuses = List.of("PAID", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED");
            for (String expected : expectedStatuses) {
                Response advance = RestAssured.given().baseUri(fixtureApi.toString())
                        .header("Authorization", "Bearer " + token)
                        .post("/qa/fixtures/{id}/advance", fixtureId);
                assertEquals(200, advance.statusCode(), advance.asString());
                assertEquals(expected, advance.jsonPath().getString("orderStatus"));
            }

            Response completed = RestAssured.given().baseUri(fixtureApi.toString())
                    .header("Authorization", "Bearer " + token)
                    .get("/qa/fixtures/{id}", fixtureId);
            assertEquals("PAID", completed.jsonPath().getString("paymentStatus"));
            assertEquals(7, completed.jsonPath().getList("timeline").size(), completed.asString());
        } finally {
            Response cleanup = RestAssured.given().baseUri(fixtureApi.toString())
                    .header("Authorization", "Bearer " + token)
                    .delete("/qa/fixtures/{id}", fixtureId);
            assertTrue(cleanup.statusCode() == 200 || cleanup.statusCode() == 204,
                    "Fixture cleanup failed: " + cleanup.asString());
            Response removed = RestAssured.given().baseUri(fixtureApi.toString())
                    .header("Authorization", "Bearer " + token)
                    .get("/qa/fixtures/{id}", fixtureId);
            assertEquals(404, removed.statusCode(), "Fixture data remains after cleanup: " + removed.asString());
        }
    }
}

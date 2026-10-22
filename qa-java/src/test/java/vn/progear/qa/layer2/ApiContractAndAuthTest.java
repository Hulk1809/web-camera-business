package vn.progear.qa.layer2;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import vn.progear.qa.support.RestSupport;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@Tag("layer2")
class ApiContractAndAuthTest {
    @Test
    void productsContractHasACollectionOfIdentifiableProducts() {
        Response response = RestSupport.request().get("/api/products");
        assertEquals(200, response.statusCode(), response.asString());
        assertTrue(response.contentType().toLowerCase().contains("json"), response.contentType());

        Object document = response.jsonPath().get();
        List<?> products = collection(document, "products", "data", "items");
        assertFalse(products.isEmpty(), "Product catalog must not be empty");
        assertTrue(products.getFirst() instanceof Map, "A product must be a JSON object");
        Map<?, ?> first = (Map<?, ?>) products.getFirst();
        assertTrue(first.containsKey("id") || first.containsKey("slug"), "Product needs id or slug");
        assertNotNull(first.get("name"), "Product needs name");
    }

    @Test
    void categoriesAndBrandsRespectJsonContract() {
        for (String path : List.of("/api/categories", "/api/brands")) {
            Response response = RestSupport.request().get(path);
            assertEquals(200, response.statusCode(), path + ": " + response.asString());
            assertTrue(response.contentType().toLowerCase().contains("json"), path);
            assertNotNull(response.jsonPath().get(), path + " returned JSON null");
        }
    }

    @Test
    void anonymousCallerCannotReadAdministrativeResources() {
        for (String path : List.of("/api/orders", "/api/dashboard/metrics", "/api/warranty")) {
            Response response = RestSupport.request().get(path);
            assertTrue(response.statusCode() == 401 || response.statusCode() == 403,
                    () -> path + " exposed to anonymous caller with status " + response.statusCode());
        }
    }

    @Test
    void malformedBearerTokenIsRejected() {
        Response response = RestSupport.request()
                .header("Authorization", "Bearer qa-intentionally-invalid")
                .get("/api/orders");
        assertTrue(response.statusCode() == 401 || response.statusCode() == 403,
                () -> "Malformed token returned " + response.statusCode());
    }

    private static List<?> collection(Object document, String... candidateKeys) {
        if (document instanceof List<?> list) return list;
        if (document instanceof Map<?, ?> map) {
            for (String key : candidateKeys) {
                if (map.get(key) instanceof List<?> list) return list;
            }
        }
        fail("Expected an array or an object containing products/data/items; got " + document);
        return List.of();
    }
}

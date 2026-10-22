package vn.progear.qa.layer4;

import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import vn.progear.qa.support.RestSupport;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@Tag("layer4")
class BusinessReadOnlyE2eTest {
    @Test
    void catalogListLeadsToAReadableProductDetail() {
        Response listResponse = RestSupport.request().get("/api/products");
        assertEquals(200, listResponse.statusCode(), listResponse.asString());
        Object root = listResponse.jsonPath().get();
        List<?> products = root instanceof List<?> list ? list : firstList((Map<?, ?>) root);
        assertNotNull(products, "Products collection not found");
        assertFalse(products.isEmpty(), "No catalog item to traverse");
        Map<?, ?> product = (Map<?, ?>) products.getFirst();
        Object slug = product.get("slug");
        if (slug == null) slug = product.get("id");
        assertNotNull(slug, "Product has neither slug nor id");

        Response detail = RestSupport.request().urlEncodingEnabled(true).get("/api/products/{slug}", slug);
        assertEquals(200, detail.statusCode(), detail.asString());
        assertNotNull(detail.jsonPath().get("name"), "Product detail has no name");
    }

    private static List<?> firstList(Map<?, ?> root) {
        for (String key : List.of("products", "data", "items")) {
            if (root.get(key) instanceof List<?> list) return list;
        }
        return null;
    }

    @Test
    void unknownWarrantyLookupDoesNotLeakOrMutateData() {
        String impossibleSerial = "QA-READONLY-NOT-FOUND-0000000000";
        Response response = RestSupport.request().get("/api/warranty/{query}", impossibleSerial);
        assertTrue(response.statusCode() == 200 || response.statusCode() == 404,
                () -> "Unknown warranty lookup returned " + response.statusCode());
        if (response.statusCode() == 200) {
            String body = response.asString().toLowerCase();
            assertTrue(body.contains("not") || body.contains("không") || body.equals("null") || body.equals("{}"),
                    "Unknown serial unexpectedly resolved to a warranty: " + response.asString());
        }
    }
}

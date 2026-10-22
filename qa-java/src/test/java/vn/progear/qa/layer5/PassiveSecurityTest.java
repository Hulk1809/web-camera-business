package vn.progear.qa.layer5;

import io.restassured.response.Response;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import vn.progear.qa.support.RestSupport;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

@Tag("layer5")
class PassiveSecurityTest {
    @Test
    void browserSecurityHeadersArePresent() {
        Response response = RestSupport.request().accept("text/html").get("/");
        assertEquals(200, response.statusCode(), response.asString());
        assertAll("browser security header baseline",
                () -> assertEquals("nosniff", header(response, "X-Content-Type-Options"),
                        "X-Content-Type-Options missing or unsafe"),
                () -> assertTrue(header(response, "Strict-Transport-Security").contains("max-age="),
                        "HSTS missing"),
                () -> assertTrue(response.getHeader("Content-Security-Policy") != null
                                || response.getHeader("Content-Security-Policy-Report-Only") != null,
                        "Content Security Policy missing"),
                () -> assertTrue(response.getHeader("X-Frame-Options") != null
                                || header(response, "Content-Security-Policy").contains("frame-ancestors"),
                        "Clickjacking protection missing"),
                () -> assertFalse(header(response, "Referrer-Policy").isBlank(),
                        "Referrer-Policy missing"),
                () -> assertFalse(header(response, "Permissions-Policy").isBlank(),
                        "Permissions-Policy missing"));
    }

    @Test
    void traceMethodIsDisabled() {
        Response response = RestSupport.request().request("TRACE", "/");
        assertTrue(response.statusCode() == 405 || response.statusCode() == 501,
                () -> "TRACE must be disabled, got " + response.statusCode());
    }

    @Test
    void arbitraryOriginDoesNotReceiveCredentialedCors() {
        Response response = RestSupport.request()
                .header("Origin", "https://evil.invalid")
                .get("/api/products");
        assertEquals(200, response.statusCode(), response.asString());
        String allowOrigin = header(response, "Access-Control-Allow-Origin");
        String allowCredentials = header(response, "Access-Control-Allow-Credentials");
        assertFalse("https://evil.invalid".equals(allowOrigin) && "true".equalsIgnoreCase(allowCredentials),
                "Arbitrary origin received credentialed CORS access");
    }

    @Test
    void errorResponseDoesNotExposeFrameworkStack() {
        Response response = RestSupport.request().get("/api/qa-definitely-missing-route");
        assertEquals(404, response.statusCode(), "Unknown API routes must not fall through to SPA");
        String body = response.asString().toLowerCase(Locale.ROOT);
        assertFalse(body.contains("node_modules") || body.contains("at ") && body.contains(".ts:"),
                "Potential stack trace disclosure: " + response.asString());
    }

    private static String header(Response response, String name) {
        String value = response.getHeader(name);
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}

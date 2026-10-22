package vn.progear.qa.layer1;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import vn.progear.qa.support.HttpSupport;
import vn.progear.qa.support.QaConfig;

import javax.net.ssl.SSLSession;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.security.cert.X509Certificate;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@Tag("layer1")
class AvailabilityTlsRedirectTest {
    @Test
    void httpsStoreIsAvailableWithValidTls() throws Exception {
        HttpResponse<Void> response = HttpSupport.client(HttpClient.Redirect.NORMAL)
                .send(HttpSupport.get(QaConfig.baseUri()), HttpResponse.BodyHandlers.discarding());

        assertTrue(response.statusCode() >= 200 && response.statusCode() < 400,
                () -> "Expected available storefront, got " + response.statusCode());
        SSLSession session = response.sslSession().orElseThrow(() ->
                new AssertionError("QA_BASE_URL must terminate TLS"));
        assertTrue(session.getProtocol().equals("TLSv1.3") || session.getProtocol().equals("TLSv1.2"),
                "Only TLS 1.2+ is accepted");
        X509Certificate certificate = (X509Certificate) session.getPeerCertificates()[0];
        certificate.checkValidity();
        assertTrue(certificate.getNotAfter().toInstant().isAfter(Instant.now().plusSeconds(7 * 86400L)),
                "Certificate expires in less than seven days");
    }

    @Test
    void plainHttpRedirectsToHttps() throws Exception {
        HttpResponse<Void> response = HttpSupport.client(HttpClient.Redirect.NEVER)
                .send(HttpSupport.get(QaConfig.httpUri()), HttpResponse.BodyHandlers.discarding());

        assertTrue(response.statusCode() == 301 || response.statusCode() == 302
                        || response.statusCode() == 307 || response.statusCode() == 308,
                () -> "HTTP must redirect, got " + response.statusCode());
        String location = response.headers().firstValue("location").orElse("");
        assertTrue(location.toLowerCase().startsWith("https://"), "Redirect must target HTTPS: " + location);
    }

    @Test
    void healthEndpointIsAvailable() throws Exception {
        HttpResponse<String> response = HttpSupport.client(HttpClient.Redirect.NORMAL)
                .send(HttpSupport.get(QaConfig.uri("/api/health")), HttpResponse.BodyHandlers.ofString());
        assertEquals(200, response.statusCode(), response.body());
        assertFalse(response.body().isBlank(), "Health response must not be empty");
    }
}

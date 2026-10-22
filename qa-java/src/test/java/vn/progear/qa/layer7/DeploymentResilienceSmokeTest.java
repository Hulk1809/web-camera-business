package vn.progear.qa.layer7;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import vn.progear.qa.support.HttpSupport;
import vn.progear.qa.support.QaConfig;

import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Tag("layer7")
class DeploymentResilienceSmokeTest {
    @Test
    void allPublicDeploymentSurfacesAreRouted() throws Exception {
        HttpClient client = HttpSupport.client(HttpClient.Redirect.NORMAL);
        for (String path : List.of("/", "/admin/", "/api/health", "/api/products")) {
            HttpResponse<String> response = client.send(HttpSupport.get(QaConfig.uri(path)),
                    HttpResponse.BodyHandlers.ofString());
            assertTrue(response.statusCode() >= 200 && response.statusCode() < 400,
                    path + " returned " + response.statusCode());
            assertFalse(response.body().isBlank(), path + " returned an empty body");
        }
    }

    @Test
    void healthRecoversAcrossConsecutiveProbes() throws Exception {
        HttpClient client = HttpSupport.client(HttpClient.Redirect.NORMAL);
        int successful = 0;
        int attempts = 5;
        for (int i = 0; i < attempts; i++) {
            try {
                HttpResponse<Void> response = client.send(HttpSupport.get(QaConfig.uri("/api/health")),
                        HttpResponse.BodyHandlers.discarding());
                if (response.statusCode() == 200) successful++;
            } catch (Exception ignored) {
                // A single transient probe may fail; the final availability threshold remains strict.
            }
            if (i + 1 < attempts) Thread.sleep(Duration.ofMillis(300));
        }
        assertTrue(successful >= 4, "Health succeeded only " + successful + "/" + attempts + " times");
    }

    @Test
    void cacheBustedSpaRoutesStillServeHtml() throws Exception {
        HttpClient client = HttpSupport.client(HttpClient.Redirect.NORMAL);
        for (String path : List.of("/?qa-smoke=deployment", "/admin/?qa-smoke=deployment")) {
            HttpResponse<String> response = client.send(HttpSupport.get(QaConfig.uri(path)),
                    HttpResponse.BodyHandlers.ofString());
            assertEquals(200, response.statusCode(), path);
            assertTrue(response.headers().firstValue("content-type").orElse("").contains("text/html"), path);
            assertTrue(response.body().toLowerCase().contains("<html"), path + " is not HTML");
        }
    }
}

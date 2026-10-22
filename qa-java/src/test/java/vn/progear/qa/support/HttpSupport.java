package vn.progear.qa.support;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.http.HttpClient;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.time.Duration;

public final class HttpSupport {
    private HttpSupport() {}

    public static HttpClient client(HttpClient.Redirect redirect) {
        HttpClient.Builder builder = HttpClient.newBuilder()
                .connectTimeout(QaConfig.timeout())
                .followRedirects(redirect);
        if (QaConfig.allowInsecureTls()) {
            builder.sslContext(insecureContext());
        }
        return builder.build();
    }

    public static java.net.http.HttpRequest get(java.net.URI uri) {
        return java.net.http.HttpRequest.newBuilder(uri)
                .timeout(QaConfig.timeout())
                .header("Accept", "application/json,text/html;q=0.9,*/*;q=0.8")
                .header("User-Agent", "ProGear-External-QA/1.0")
                .GET().build();
    }

    private static SSLContext insecureContext() {
        try {
            TrustManager[] trustAll = {new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                public void checkClientTrusted(X509Certificate[] chain, String authType) {}
                public void checkServerTrusted(X509Certificate[] chain, String authType) {}
            }};
            SSLContext context = SSLContext.getInstance("TLS");
            context.init(null, trustAll, new SecureRandom());
            return context;
        } catch (Exception e) {
            throw new IllegalStateException("Cannot initialize opt-in insecure TLS", e);
        }
    }
}

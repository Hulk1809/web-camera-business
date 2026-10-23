package vn.progear.qa.support;

import java.net.URI;
import java.time.Duration;
import java.util.Locale;

public final class QaConfig {
    public static final String PRODUCTION_URL = "https://progear.74.176.156.158.nip.io";
    private static final URI BASE_URI = cleanUri(env("QA_BASE_URL", PRODUCTION_URL));

    private QaConfig() {}

    public static URI baseUri() {
        return BASE_URI;
    }

    public static URI uri(String path) {
        String normalized = path.startsWith("/") ? path : "/" + path;
        return BASE_URI.resolve(normalized);
    }

    public static URI httpUri() {
        return URI.create("http://" + BASE_URI.getAuthority() + "/");
    }

    public static Duration timeout() {
        return Duration.ofSeconds(longEnv("QA_TIMEOUT_SECONDS", 20));
    }

    public static boolean allowInsecureTls() {
        return boolEnv("QA_ALLOW_INSECURE_TLS", false);
    }

    public static boolean javaTarget() {
        return "java".equalsIgnoreCase(env("QA_TARGET", "legacy"));
    }

    public static int intEnv(String name, int fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : Integer.parseInt(value);
    }

    public static long longEnv(String name, long fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : Long.parseLong(value);
    }

    private static boolean boolEnv(String name, boolean fallback) {
        String value = System.getenv(name);
        return value == null ? fallback : Boolean.parseBoolean(value.toLowerCase(Locale.ROOT));
    }

    private static String env(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }

    private static URI cleanUri(String value) {
        URI uri = URI.create(value.endsWith("/") ? value : value + "/");
        if (uri.getScheme() == null || uri.getHost() == null) {
            throw new IllegalArgumentException("URL must be absolute: " + value);
        }
        return uri;
    }
}

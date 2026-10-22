package vn.progear.qa.layer6;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import vn.progear.qa.support.HttpSupport;
import vn.progear.qa.support.QaConfig;

import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@Tag("layer6")
class PerformanceThresholdTest {
    @Test
    void healthLatencyAndReliabilityStayWithinThreshold() throws Exception {
        int requests = QaConfig.intEnv("QA_PERF_REQUESTS", 20);
        int concurrency = QaConfig.intEnv("QA_PERF_CONCURRENCY", 4);
        long p95LimitMs = QaConfig.longEnv("QA_PERF_P95_MS", 1500);
        assertTrue(requests >= 5 && requests <= 500, "QA_PERF_REQUESTS must be 5..500");
        assertTrue(concurrency >= 1 && concurrency <= 20, "QA_PERF_CONCURRENCY must be 1..20");

        HttpClient client = HttpSupport.client(HttpClient.Redirect.NORMAL);
        ExecutorService pool = Executors.newFixedThreadPool(concurrency);
        List<Future<Result>> futures = new ArrayList<>();
        try {
            for (int i = 0; i < requests; i++) {
                futures.add(pool.submit(() -> timedGet(client)));
            }
            List<Result> results = new ArrayList<>();
            for (Future<Result> future : futures) results.add(future.get(QaConfig.timeout().toSeconds(), TimeUnit.SECONDS));
            long failures = results.stream().filter(r -> r.status != 200).count();
            List<Long> latency = results.stream().map(r -> r.millis).sorted(Comparator.naturalOrder()).toList();
            long p95 = latency.get((int) Math.ceil(latency.size() * 0.95) - 1);
            assertEquals(0, failures, "Non-200 responses: " + failures + "/" + requests);
            assertTrue(p95 <= p95LimitMs,
                    () -> "p95 " + p95 + "ms exceeded " + p95LimitMs + "ms; samples=" + latency);
        } finally {
            pool.shutdownNow();
        }
    }

    private Result timedGet(HttpClient client) throws Exception {
        long start = System.nanoTime();
        HttpResponse<Void> response = client.send(HttpSupport.get(QaConfig.uri("/api/health")),
                HttpResponse.BodyHandlers.discarding());
        return new Result(response.statusCode(), TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start));
    }

    private record Result(int status, long millis) {}
}

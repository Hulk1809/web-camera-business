package com.webcamera.platform.ui;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;

class CheckoutAttemptGuardTest {
    @Test
    void blocksConcurrentSubmitAndKeepsKeyForUnchangedRetry() {
        CheckoutAttemptGuard guard = guard();

        String first = guard.start().orElseThrow();
        assertThat(guard.start()).isEmpty();
        guard.failed();

        assertThat(guard.start()).contains(first);
    }

    @Test
    void changedPayloadAfterFailureGetsNewKey() {
        CheckoutAttemptGuard guard = guard();
        String first = guard.start().orElseThrow();
        guard.failed();
        guard.payloadChanged();

        String second = guard.start().orElseThrow();
        assertThat(second).isEqualTo("key-2").isNotEqualTo(first);
    }

    @Test
    void successfulAttemptGetsNewKeyNextTime() {
        CheckoutAttemptGuard guard = guard();
        String first = guard.start().orElseThrow();
        guard.succeeded();

        String second = guard.start().orElseThrow();
        assertThat(second).isEqualTo("key-2").isNotEqualTo(first);
    }

    private CheckoutAttemptGuard guard() {
        AtomicInteger sequence = new AtomicInteger();
        return new CheckoutAttemptGuard(() -> "key-" + sequence.incrementAndGet());
    }
}

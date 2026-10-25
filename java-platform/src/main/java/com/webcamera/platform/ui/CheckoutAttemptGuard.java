package com.webcamera.platform.ui;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

final class CheckoutAttemptGuard {
    private final Supplier<String> keys;
    private String key;
    private boolean inProgress;

    CheckoutAttemptGuard() {
        this(() -> UUID.randomUUID().toString());
    }

    CheckoutAttemptGuard(Supplier<String> keys) {
        this.keys = keys;
    }

    synchronized Optional<String> start() {
        if (inProgress) return Optional.empty();
        if (key == null) key = keys.get();
        inProgress = true;
        return Optional.of(key);
    }

    synchronized void failed() {
        inProgress = false;
    }

    synchronized void succeeded() {
        inProgress = false;
        key = null;
    }

    synchronized void payloadChanged() {
        if (!inProgress) key = null;
    }
}

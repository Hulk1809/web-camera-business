ALTER TABLE camera_platform.customer_order
    ADD COLUMN idempotency_key VARCHAR(100),
    ADD COLUMN checkout_fingerprint VARCHAR(64);

ALTER TABLE camera_platform.customer_order
    ADD CONSTRAINT customer_order_idempotency_pair_check CHECK (
        (idempotency_key IS NULL AND checkout_fingerprint IS NULL)
        OR (idempotency_key IS NOT NULL AND checkout_fingerprint IS NOT NULL)
    );

CREATE UNIQUE INDEX uq_customer_order_customer_idempotency
    ON camera_platform.customer_order(user_id, idempotency_key)
    WHERE idempotency_key IS NOT NULL;

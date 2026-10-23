ALTER TABLE camera_platform.customer_order
    ADD COLUMN recipient_name VARCHAR(120),
    ADD COLUMN recipient_email VARCHAR(254),
    ADD COLUMN recipient_phone VARCHAR(30),
    ADD COLUMN shipping_address VARCHAR(1000),
    ADD COLUMN payment_method VARCHAR(30);

ALTER TABLE camera_platform.order_item
    ADD COLUMN product_sku VARCHAR(80),
    ADD COLUMN product_name VARCHAR(180);

UPDATE camera_platform.order_item item
SET product_sku = product.sku,
    product_name = product.name
FROM camera_platform.product product
WHERE product.id = item.product_id;

ALTER TABLE camera_platform.order_item
    ALTER COLUMN product_sku SET NOT NULL,
    ALTER COLUMN product_name SET NOT NULL;

CREATE TABLE camera_platform.order_status_event (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    order_id UUID NOT NULL REFERENCES camera_platform.customer_order(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN
        ('DRAFT', 'PLACED', 'PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
    note VARCHAR(240) NOT NULL DEFAULT '',
    recorded_at TIMESTAMPTZ NOT NULL
);

INSERT INTO camera_platform.order_status_event
    (id, version, created_at, updated_at, order_id, status, note, recorded_at)
SELECT gen_random_uuid(), 0, created_at, created_at, id, status, 'Dữ liệu trạng thái hiện có', created_at
FROM camera_platform.customer_order;

CREATE INDEX idx_order_status_event_order_time
    ON camera_platform.order_status_event(order_id, recorded_at);

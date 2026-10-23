ALTER TABLE camera_platform.app_user DROP CONSTRAINT IF EXISTS app_user_role_check;
ALTER TABLE camera_platform.app_user
    ADD CONSTRAINT app_user_role_check CHECK (role IN ('CUSTOMER', 'STAFF', 'ADMIN'));

CREATE TABLE camera_platform.category (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE camera_platform.brand (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE camera_platform.product
    ADD COLUMN category_id UUID REFERENCES camera_platform.category(id),
    ADD COLUMN brand_id UUID REFERENCES camera_platform.brand(id),
    ADD COLUMN specifications JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE camera_platform.product_image (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    product_id UUID NOT NULL REFERENCES camera_platform.product(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    alt_text VARCHAR(255) NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    primary_image BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_product_image_product_sort ON camera_platform.product_image(product_id, sort_order);
CREATE UNIQUE INDEX uq_product_primary_image ON camera_platform.product_image(product_id) WHERE primary_image;

ALTER TABLE camera_platform.customer_order DROP CONSTRAINT IF EXISTS customer_order_status_check;
ALTER TABLE camera_platform.customer_order
    ALTER COLUMN user_id DROP NOT NULL,
    ADD COLUMN order_number VARCHAR(32),
    ADD COLUMN payment_status VARCHAR(24) NOT NULL DEFAULT 'UNPAID',
    ADD COLUMN sales_channel VARCHAR(20) NOT NULL DEFAULT 'ONLINE',
    ADD COLUMN created_by_id UUID REFERENCES camera_platform.app_user(id),
    ADD COLUMN cancellation_reason VARCHAR(500),
    ADD COLUMN cancelled_at TIMESTAMPTZ,
    ADD CONSTRAINT customer_order_status_check CHECK (status IN
        ('DRAFT', 'PLACED', 'PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
    ADD CONSTRAINT customer_order_payment_status_check CHECK (payment_status IN
        ('UNPAID', 'PENDING', 'AUTHORIZED', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED')),
    ADD CONSTRAINT customer_order_sales_channel_check CHECK (sales_channel IN ('ONLINE', 'POS'));
UPDATE camera_platform.customer_order SET order_number = 'LEGACY-' || upper(substr(replace(id::text, '-', ''), 1, 12));
ALTER TABLE camera_platform.customer_order ALTER COLUMN order_number SET NOT NULL;
ALTER TABLE camera_platform.customer_order ADD CONSTRAINT uq_customer_order_number UNIQUE (order_number);

CREATE TABLE camera_platform.payment (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    order_id UUID NOT NULL REFERENCES camera_platform.customer_order(id),
    provider VARCHAR(40) NOT NULL,
    provider_reference VARCHAR(120),
    method VARCHAR(30) NOT NULL,
    status VARCHAR(24) NOT NULL CHECK (status IN
        ('PENDING', 'AUTHORIZED', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED', 'CANCELLED')),
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    paid_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX uq_payment_provider_reference
    ON camera_platform.payment(provider, provider_reference) WHERE provider_reference IS NOT NULL;
CREATE INDEX idx_payment_order ON camera_platform.payment(order_id);

CREATE TABLE camera_platform.camera_serial (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    product_id UUID NOT NULL REFERENCES camera_platform.product(id),
    serial_number VARCHAR(120) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('IN_STOCK', 'RESERVED', 'SOLD', 'RETURNED', 'SERVICE', 'RETIRED')),
    order_item_id UUID REFERENCES camera_platform.order_item(id),
    sold_at TIMESTAMPTZ
);
CREATE INDEX idx_camera_serial_product_status ON camera_platform.camera_serial(product_id, status);

CREATE TABLE camera_platform.warranty (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    camera_serial_id UUID NOT NULL UNIQUE REFERENCES camera_platform.camera_serial(id),
    customer_id UUID REFERENCES camera_platform.app_user(id),
    order_id UUID NOT NULL REFERENCES camera_platform.customer_order(id),
    starts_on DATE NOT NULL,
    expires_on DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRED', 'VOIDED', 'CLAIMED')),
    CHECK (expires_on >= starts_on)
);
CREATE INDEX idx_warranty_customer ON camera_platform.warranty(customer_id);
CREATE INDEX idx_order_status_created ON camera_platform.customer_order(status, created_at DESC);
CREATE INDEX idx_product_category_active ON camera_platform.product(category_id, active);
CREATE INDEX idx_product_brand_active ON camera_platform.product(brand_id, active);

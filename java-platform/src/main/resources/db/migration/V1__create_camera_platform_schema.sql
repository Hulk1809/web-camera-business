CREATE SCHEMA IF NOT EXISTS camera_platform;

CREATE TABLE camera_platform.app_user (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'ADMIN')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE camera_platform.product (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    sku VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    description VARCHAR(2000) NOT NULL DEFAULT '',
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE camera_platform.customer_order (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    user_id UUID NOT NULL REFERENCES camera_platform.app_user(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('DRAFT', 'PLACED', 'PAID', 'SHIPPED', 'CANCELLED'))
);

CREATE TABLE camera_platform.order_item (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    order_id UUID NOT NULL REFERENCES camera_platform.customer_order(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES camera_platform.product(id),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE camera_platform.chat_session (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    user_id UUID REFERENCES camera_platform.app_user(id)
);

CREATE TABLE camera_platform.chat_message (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    session_id UUID NOT NULL REFERENCES camera_platform.chat_session(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('CUSTOMER', 'AGENT', 'SYSTEM')),
    content VARCHAR(4000) NOT NULL
);

CREATE INDEX idx_order_user_created ON camera_platform.customer_order(user_id, created_at DESC);
CREATE INDEX idx_chat_session_user_created ON camera_platform.chat_session(user_id, created_at DESC);
CREATE INDEX idx_chat_message_session_created ON camera_platform.chat_message(session_id, created_at);

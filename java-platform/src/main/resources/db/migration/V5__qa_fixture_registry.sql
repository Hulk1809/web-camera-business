CREATE TABLE camera_platform.qa_fixture (
    id UUID PRIMARY KEY,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    scenario VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('READY')),
    customer_id UUID NOT NULL,
    staff_id UUID NOT NULL,
    product_id UUID NOT NULL,
    order_id UUID NOT NULL,
    payment_id UUID NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_qa_fixture_expiry ON camera_platform.qa_fixture(expires_at);

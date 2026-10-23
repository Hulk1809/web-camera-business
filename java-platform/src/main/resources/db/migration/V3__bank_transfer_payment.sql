ALTER TABLE camera_platform.payment
    ADD COLUMN transfer_content VARCHAR(80),
    ADD COLUMN confirmed_by_id UUID REFERENCES camera_platform.app_user(id),
    ADD COLUMN confirmed_at TIMESTAMPTZ;

CREATE UNIQUE INDEX uq_payment_transfer_content
    ON camera_platform.payment(transfer_content) WHERE transfer_content IS NOT NULL;

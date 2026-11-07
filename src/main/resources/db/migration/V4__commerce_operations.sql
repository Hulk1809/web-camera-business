ALTER TABLE product ADD COLUMN IF NOT EXISTS stock INT NOT NULL DEFAULT 10 CHECK (stock >= 0);
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NOT NULL DEFAULT '';

CREATE TABLE app_user (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(200) NOT NULL UNIQUE CHECK (btrim(email) <> ''),
    password_hash VARCHAR(200) NOT NULL,
    full_name VARCHAR(200) NOT NULL CHECK (btrim(full_name) <> ''),
    address TEXT NOT NULL DEFAULT '',
    role VARCHAR(30) NOT NULL CHECK (role IN ('ROLE_CUSTOMER', 'ROLE_STAFF', 'ROLE_ADMIN')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO app_user (email, password_hash, full_name, address, role, enabled)
SELECT v.email, v.password_hash, v.full_name, v.address, v.role, true
FROM (VALUES
    ('admin@progear.vn', '$2a$10$bnno/Q4a1fyt/YqYsGpJXOJzMjd.NXGiyaJIreEGODd4CjRz5RZsa', 'Quản trị viên ProGear', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'ROLE_ADMIN'),
    ('staff@progear.vn', '$2a$10$cxdPZoyPbFx35/DvSL8CyuqGOP030JjiMnxltqMtWSqt9NDiSwsYG', 'Nhân viên Quầy POS', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'ROLE_STAFF'),
    ('customer@progear.vn', '$2a$10$GvZ8Lq/8XE.TPXgH1PSXPei6L5VhB6xjFtH2Upz7aIWFDJzs1BXZ2', 'Nguyễn Văn Nhiếp Ảnh', '45 Lê Lợi, Quận 1, TP.HCM', 'ROLE_CUSTOMER')
) AS v(email, password_hash, full_name, address, role)
WHERE NOT EXISTS (SELECT 1 FROM app_user u WHERE u.email = v.email);

CREATE TABLE customer_order (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES app_user(id),
    idempotency_key VARCHAR(120) NOT NULL UNIQUE CHECK (btrim(idempotency_key) <> ''),
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('ONLINE', 'POS')),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('COD', 'BANK_TRANSFER', 'CASH', 'CARD')),
    payment_status VARCHAR(30) NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    shipping_address TEXT NOT NULL DEFAULT '',
    total_amount NUMERIC(19, 2) NOT NULL CHECK (total_amount >= 0),
    stock_restored BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_item (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    product_name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    unit_price NUMERIC(19, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0)
);

CREATE TABLE serial_unit (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) NOT NULL UNIQUE CHECK (btrim(serial_number) <> ''),
    status VARCHAR(30) NOT NULL CHECK (status IN ('IN_STOCK', 'SOLD', 'RETURNED')),
    order_id BIGINT REFERENCES customer_order(id) ON DELETE SET NULL,
    warranty_until DATE
);

INSERT INTO serial_unit (product_id, serial_number, status, warranty_until)
SELECT p.id, v.serial_number, v.status, v.warranty_until
FROM (VALUES
    ('SONY-A7M4-BODY', 'SN-SONY-A7M4-001', 'IN_STOCK', NULL::DATE),
    ('SONY-A7M4-BODY', 'SN-SONY-A7M4-002', 'IN_STOCK', NULL::DATE),
    ('CANON-R6M2-BODY', 'SN-CANON-R6M2-001', 'IN_STOCK', NULL::DATE),
    ('CANON-R6M2-BODY', 'SN-CANON-R6M2-002', 'IN_STOCK', NULL::DATE),
    ('FUJI-XT5-SLV', 'SN-FUJI-XT5-001', 'IN_STOCK', NULL::DATE),
    ('NIKON-ZF-BODY', 'SN-NIKON-ZF-001', 'IN_STOCK', NULL::DATE),
    ('SONY-2470-GM2', 'SN-SONY-2470-001', 'IN_STOCK', NULL::DATE),
    ('SIGMA-85-14-SE', 'SN-SIGMA-85-001', 'IN_STOCK', NULL::DATE),
    ('FUJI-X100VI-BLK', 'SN-FUJI-X100VI-001', 'IN_STOCK', NULL::DATE),
    ('PD-TRIPOD-CARBON', 'SN-PD-TRIPOD-001', 'IN_STOCK', NULL::DATE),
    ('SONY-A7M4-BODY', 'SN-DEMO-WARRANTY-2027', 'SOLD', DATE '2027-12-31')
) AS v(sku, serial_number, status, warranty_until)
JOIN product p ON p.sku = v.sku
WHERE NOT EXISTS (SELECT 1 FROM serial_unit s WHERE s.serial_number = v.serial_number);

CREATE TABLE audit_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor VARCHAR(200) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

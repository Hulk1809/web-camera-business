CREATE TABLE category (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL CHECK (btrim(name) <> ''),
    visible BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE brand (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL CHECK (btrim(name) <> ''),
    visible BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE product (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES category(id),
    brand_id BIGINT NOT NULL REFERENCES brand(id),
    name VARCHAR(200) NOT NULL CHECK (btrim(name) <> ''),
    sku VARCHAR(100) NOT NULL UNIQUE CHECK (sku = btrim(sku) AND sku <> ''),
    price NUMERIC(19, 2) NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL DEFAULT '',
    visible BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX product_visible_id ON product(id) WHERE visible;

CREATE TABLE schema_marker (
    id SMALLINT PRIMARY KEY,
    installed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT schema_marker_single_row CHECK (id = 1)
);

INSERT INTO schema_marker (id) VALUES (1);

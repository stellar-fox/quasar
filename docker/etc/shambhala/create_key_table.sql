CREATE TABLE IF NOT EXISTS key_v1 (
    id            bigserial   PRIMARY KEY NOT NULL,
    creation_time timestamptz NOT NULL DEFAULT now(),
    g_public      varchar(56) NOT NULL,
    c_uuid        uuid        NOT NULL UNIQUE,
    enc_skp       text        DEFAULT NULL,
    usage_count   bigint      NOT NULL DEFAULT 0,
    last_usage    timestamptz DEFAULT NULL,
    failure_count bigint      NOT NULL DEFAULT 0,
    last_failure  timestamptz DEFAULT NULL,
    datum         jsonb       NOT NULL DEFAULT jsonb_build_object()
) WITH (
    OIDS=FALSE
);

ALTER        TABLE key_v1 OWNER TO "shambhala";
GRANT ALL ON TABLE key_v1 TO       "shambhala";
COMMENT   ON TABLE key_v1 IS       'Shambhala server-side key-structure.';

CREATE INDEX key_v1_creation_time_idx ON key_v1 USING btree (creation_time);
CREATE INDEX key_v1_g_public_idx      ON key_v1 USING btree (g_public);
CREATE INDEX key_v1_data_gin_idx      ON key_v1 USING gin   (datum);
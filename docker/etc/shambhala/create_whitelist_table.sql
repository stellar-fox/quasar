CREATE TABLE IF NOT EXISTS white_v1 (
    id            bigserial   PRIMARY KEY NOT NULL,
    domain        text        NOT NULL,
    creation_time timestamptz NOT NULL DEFAULT now(),
    validity_time timestamptz NOT NULL DEFAULT now() + interval '1 year'
) WITH (
    OIDS=FALSE
);

ALTER        TABLE white_v1 OWNER TO "shambhala";
GRANT ALL ON TABLE white_v1 TO       "shambhala";
COMMENT   ON TABLE white_v1 IS       'Shambhala whitelist.';

CREATE INDEX white_v1_domain_idx ON white_v1 USING btree (domain);
FROM postgres:11.0-alpine

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV DENEB_COMMIT d39959584c835bbf46c5e99f7d12e8e00fdde870

RUN set -e \
    && apk update \
    && apk add --update \
        bash \
        unzip \
    && wget -O deneb.zip https://github.com/stellar-fox/deneb/archive/${DENEB_COMMIT}.zip \
    && unzip deneb.zip \
    && mv /deneb-${DENEB_COMMIT} /deneb \
    && cd /deneb \
    && cp /deneb/db/schema.sql /docker-entrypoint-initdb.d/001_schema.sql \
    && cp /deneb/db/mock-data.sql /docker-entrypoint-initdb.d/002_mock-data.sql \
    && cp /deneb/db/migrations/001_stringify_nulls.sql /docker-entrypoint-initdb.d/003_stringify_nulls.sql \
    && rm -rf /deneb \
    && echo "Done"


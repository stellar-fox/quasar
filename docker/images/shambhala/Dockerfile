FROM node:10.12.0-alpine

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV SHAMBHALA_COMMIT 6799f17a78edfa0041e2e610da183cb23cd7aa80

RUN set -e \
    && apk update \
    && apk add --update \
        alpine-sdk \
        bash \
        make \
        python \
        unzip \
    && wget -O shambhala.zip https://github.com/stellar-fox/shambhala/archive/${SHAMBHALA_COMMIT}.zip \
    && unzip shambhala.zip \
    && mv /shambhala-${SHAMBHALA_COMMIT} /shambhala \
    && cd /shambhala \
    && npm install \
    && echo "Done"

WORKDIR /shambhala
ENTRYPOINT ["npm", "start"]

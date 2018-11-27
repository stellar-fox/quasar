FROM node:10.12.0-alpine

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV SHAMBHALA_COMMIT d9c5c6c8acb23a8636ff108a37797889ef11bdbf

ADD *.json /configs/

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
    && mv /configs/* /shambhala/src/config/. \
    && rm -rf /configs \
    && npm install \
    && npm run build:lib \
    && echo "Done"

WORKDIR /shambhala

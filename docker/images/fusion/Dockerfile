FROM node:10.12.0-alpine

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV FUSION_COMMIT 943ec5bba71ef6177e0722934aba6e3dbdda5fb9

RUN set -e \
    && apk update \
    && apk add --update \
        alpine-sdk \
        bash \
        make \
        python \
        unzip \
    && wget -O fusion.zip https://github.com/stellar-fox/fusion/archive/${FUSION_COMMIT}.zip \
    && unzip fusion.zip \
    && mv /fusion-${FUSION_COMMIT} /fusion \
    && cd /fusion \
    && npm install \
    && echo "Done"

WORKDIR /fusion
ENTRYPOINT ["npm", "start"]

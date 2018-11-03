FROM node:10.12.0-alpine

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV DENEB_COMMIT d39959584c835bbf46c5e99f7d12e8e00fdde870

RUN set -e \
    && apk update \
    && apk add --update \
        alpine-sdk \
        bash \
        make \
        python \
        unzip \
    && wget -O deneb.zip https://github.com/stellar-fox/deneb/archive/${DENEB_COMMIT}.zip \
    && unzip deneb.zip \
    && mv /deneb-${DENEB_COMMIT} /deneb \
    && cd /deneb \
    && npm install \
    && echo "Done"

WORKDIR /deneb
ENTRYPOINT ["npm", "start"]

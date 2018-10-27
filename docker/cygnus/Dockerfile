FROM node:10.12.0-alpine

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV CYGNUS_VERSION v.0.1.47

RUN set -e \
    && apk update \
    && apk add --update \
        alpine-sdk \
        bash \
        python \
        make \
    && wget -O cygnus.tar.gz https://github.com/stellar-fox/cygnus/archive/${CYGNUS_VERSION}.tar.gz \
    && tar -zxvf cygnus.tar.gz \
    && mv /cygnus-${CYGNUS_VERSION} /cygnus \
    && cd /cygnus \
    && npm install \
    && echo "Done"

WORKDIR cygnus
ENTRYPOINT ["npm", "start"]

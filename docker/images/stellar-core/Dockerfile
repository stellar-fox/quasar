FROM alpine:3.8

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV STELLAR_CORE_VERSION=v10.0.0

RUN set -e \
    && apk update \
    && apk add --update \
        autoconf \
        automake \
        alpine-sdk \
        bash \
        bison \
        clang-dev \
        flex \
        git \
        linux-headers \
        postgresql-dev \
        libtool \
        pkgconfig \
    && wget -O pandoc-2.4-linux.tar.gz https://github.com/jgm/pandoc/releases/download/2.4/pandoc-2.4-linux.tar.gz \
    && tar xvzf pandoc-2.4-linux.tar.gz \
    && ln -s /pandoc-2.4/bin/pandoc /usr/bin/pandoc \
    && git clone https://github.com/stellar/stellar-core.git \
    && cd /stellar-core \
    && git fetch --all --tags --prune \
    && git checkout tags/${STELLAR_CORE_VERSION} -b tags/${STELLAR_CORE_VERSION} \
    && cd /stellar-core \
    && ./autogen.sh \
    && ./configure \
    && cd /stellar-core \
    && make \
    && make install \
    && rm -rf /stellar-core \
    && echo "Done"


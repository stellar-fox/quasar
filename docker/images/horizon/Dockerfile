FROM ubuntu:18.04
# Alpine couldnt be used - didnt support well the binary

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

ENV HORIZON_VERSION v0.14.2

RUN set -e \
    && apt update -y \
    && apt install -y \
        bash \
        wget \
    && wget -O horizon.tar.gz https://github.com/stellar/go/releases/download/horizon-${HORIZON_VERSION}/horizon-${HORIZON_VERSION}-linux-amd64.tar.gz \ 
    && tar xvzf horizon.tar.gz \
    && mv /horizon-${HORIZON_VERSION}-linux-amd64 /horizon \
    && rm /horizon.tar.gz \
    && ln -s /horizon/horizon /usr/bin/horizon \
    && echo "Done"


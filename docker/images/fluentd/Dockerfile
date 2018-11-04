FROM fluent/fluentd:v1.2.6

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

RUN set -e \
    && apk update \
    && apk add --update --virtual .build-deps \
        bash \
        build-base \
        ruby-dev \
        sudo \
    && sudo gem install -v 1.0.0 fluent-plugin-influxdb \
    && sudo gem sources --clear-all \
    && apk del .build-deps \
    && rm -rf \
        /var/cache/apk/* \
        /home/fluent/.gem/ruby/2.4.0/cache/*.gem \
    && echo "Done"

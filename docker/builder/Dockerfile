FROM frolvlad/alpine-oraclejdk8:8.192.12-full

MAINTAINER Grzegorz Szadkowski <5392918+gszadkow@users.noreply.github.com>

# Env vars
## Node
ENV NODE_VERSION 11.0.0

## Yarn
ENV YARN_VERSION 1.12.1

## Gradle
ENV GRADLE_VERSION 4.10.2
ENV GRADLE_HOME /usr/lib/gradle/gradle-${GRADLE_VERSION}
ENV PATH ${PATH}:${GRADLE_HOME}/bin

## Android
ENV ANDROID_HOME /opt/android-sdk-linux
ENV SDK_TOOLS_VERSION 25.2.5
ENV API_LEVELS android-28,android-27
ENV BUILD_TOOLS_VERSIONS build-tools-28.0.3,build-tools-27.0.3
ENV ANDROID_EXTRAS extra-android-m2repository,extra-android-support,extra-google-google_play_services,extra-google-m2repository
ENV PATH ${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools

# Run
## Global
RUN set -xe \
    && apk update \
    && apk add --no-cache \
        alpine-sdk \
        bash \
        binutils-gold \
        curl \
        g++ \
        gcc \
        gnupg \
        libgcc \
        libstdc++ \
        linux-headers \ 
        make \
        python \
        unzip \
        tar \
        xz \ 
    && for key in \
        # Node
        # gpg keys listed at https://github.com/nodejs/node#release-team
        94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
        FD3A5288F042B6850C66B31F09FE44734EB7990E \
        71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
        DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
        C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
        B9AE9905FFD7803F25714661B63B535A4C206CA9 \
        56730D5401028683275BD23C23EFEFE93C4CFFFE \
        77984A986EBC2AA786BC0F66B01FBB92821C587A \
        8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600 \
        # Yarn
        6A010C5166006599AA17F08146C2130DFD2497F5 \
    ; do \
      gpg --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "${key}" || \
      gpg --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "${key}" || \
      gpg --keyserver hkp://pgp.mit.edu:80 --recv-keys "${key}" ; \
    done \
# Node
    && cd /tmp \
    && curl -fsSLO --compressed "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}.tar.xz" \
    && curl -fsSLO --compressed "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt.asc" \
    && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
    && grep " node-v${NODE_VERSION}.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
    && tar -xf "node-v${NODE_VERSION}.tar.xz" \
    && cd "node-v${NODE_VERSION}" \
    && ./configure \
    && make -j$(getconf _NPROCESSORS_ONLN) \
    && make install \
    && cd .. \
    && rm -Rf "node-v${NODE_VERSION}" \
    && rm "node-v${NODE_VERSION}.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
## Yarn
    && cd /tmp \
    && curl -fsSLO --compressed "https://yarnpkg.com/downloads/${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz" \
    && curl -fsSLO --compressed "https://yarnpkg.com/downloads/${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz.asc" \
    && gpg --batch --verify yarn-v${YARN_VERSION}.tar.gz.asc yarn-v${YARN_VERSION}.tar.gz \
    && mkdir -p /opt \
    && tar -xzf yarn-v${YARN_VERSION}.tar.gz -C /opt/ \
    && ln -s /opt/yarn-v${YARN_VERSION}/bin/yarn /usr/local/bin/yarn \
    && ln -s /opt/yarn-v${YARN_VERSION}/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz.asc yarn-v${YARN_VERSION}.tar.gz \
# Gradle
    && mkdir /usr/lib/gradle /app \
    && cd /usr/lib/gradle \
    && set -x \
    && curl -L -O https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip \
    && unzip gradle-${GRADLE_VERSION}-bin.zip \
    && rm gradle-${GRADLE_VERSION}-bin.zip \
# Android
    && mkdir -p ${ANDROID_HOME} \ 
    && cd /opt \
    && wget -q http://dl.google.com/android/repository/tools_r${SDK_TOOLS_VERSION}-linux.zip -O android-sdk-tools.zip \
    && unzip -q android-sdk-tools.zip -d ${ANDROID_HOME} \
    && rm -f android-sdk-tools.zip \
    && echo y | android update sdk --no-ui -a --filter \
       tools,platform-tools,${ANDROID_EXTRAS},${API_LEVELS},${BUILD_TOOLS_VERSIONS} --no-https \
## Cordova
    && npm install -g cordova \
## Add builder group and user
    && addgroup -g 1000 builder \
    && adduser -u 1000 -G builder -s /bin/bash -D builder

#USER builder

WORKDIR /home/builder

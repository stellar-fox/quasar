#!/bin/bash
docker rm -f horizon
DATA_DIR=`readlink -f $1`
mkdir -p $DATA_DIR
chmod a+w $DATA_DIR
docker run -d \
    --name horizon \
    -d \
    -e POSTGRES_DB=horizon \
    -e POSTGRES_PASSWORD=horizon \
    -e POSTGRES_USER=horizon \
    horizon:latest

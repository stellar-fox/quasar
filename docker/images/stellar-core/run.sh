#!/bin/bash
docker rm -f stellar-core
DATA_DIR=`readlink -f $1`
mkdir -p $DATA_DIR
chmod a+w $DATA_DIR
docker run -d \
    --name stellar-core \
    -d \
    -e POSTGRES_DB=db_name \
    -e POSTGRES_PASSWORD=some_password \
    -e POSTGRES_USER=aquila \
    stellar-core:latest

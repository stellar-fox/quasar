#!/bin/bash
docker rm -f deneb-db
DATA_DIR=`readlink -f $1`
mkdir -p $DATA_DIR
chmod a+w $DATA_DIR
docker run -d \
    --name deneb-db \
    -d \
    -e POSTGRES_DB=db_name \
    -e POSTGRES_PASSWORD=some_password \
    -e POSTGRES_USER=aquila \
    -p 5432:5432 \
    --user "$(id -u):$(id -g)" \
    -v /etc/passwd:/etc/passwd:ro \
    -v $DATA_DIR:/var/lib/postgresql/data:z \
    deneb-db:latest

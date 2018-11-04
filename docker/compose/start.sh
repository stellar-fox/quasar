#!/bin/bash
export STELLAR_ROOT=${1:-$STELLAR_HOME}
export TARGET=${2:-test}
export WORKSPACE=$STELLAR_ROOT/$TARGET
export SENSITIVE_CONFIG_ROOT=$WORKSPACE/etc
export CONFIG_ROOT=../etc
export DATA_ROOT=$WORKSPACE/data
export USER_ME=$(id -u)
export GROUP_ME=$(id -g)

mkdir -p $DATA_ROOT/chronograf
chmod a+w $DATA_ROOT/chronograf
mkdir -p $DATA_ROOT/deneb-db
chmod a+w $DATA_ROOT/deneb-db
mkdir -p $DATA_ROOT/grafana
chmod a+w $DATA_ROOT/grafana
mkdir -p $DATA_ROOT/influxdb
chmod a+w $DATA_ROOT/influxdb
mkdir -p $DATA_ROOT/kapacitor
chmod a+w $DATA_ROOT/kapacitor
mkdir -p ${DATA_ROOT}/stellar-core-horizon
chmod a+w ${DATA_ROOT}/stellar-core-horizon

docker-compose up -d

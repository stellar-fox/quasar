#!/bin/bash
export STELLAR_ROOT=${1:-$STELLAR_HOME}
export TARGET=${2:-test}
export WORKSPACE=$STELLAR_ROOT/$TARGET
export SENSITIVE_CONFIG_ROOT=$WORKSPACE/etc
export CONFIG_ROOT=../etc
export DATA_ROOT=$WORKSPACE/data
export LOG_ROOT=$WORKSPACE/log
export USER_ME=$(id -u)
export GROUP_ME=$(id -g)
export DOMAIN=${TARGET}.intranet.stellar-fox.net

mkdir -p $DATA_ROOT/chronograf
chmod a+w $DATA_ROOT/chronograf
mkdir -p $DATA_ROOT/deneb-db
chmod a+w $DATA_ROOT/deneb-db
mkdir -p $DATA_ROOT/grafana
chmod a+w $DATA_ROOT/grafana
mkdir -p $DATA_ROOT/horizon-db
chmod a+w $DATA_ROOT/horizon-db
mkdir -p $DATA_ROOT/influxdb
chmod a+w $DATA_ROOT/influxdb
mkdir -p $DATA_ROOT/kapacitor
chmod a+w $DATA_ROOT/kapacitor
mkdir -p $DATA_ROOT/nginx
chmod a+w $DATA_ROOT/nginx
mkdir -p ${DATA_ROOT}/stellar-core-db
chmod a+w ${DATA_ROOT}/stellar-core-db
mkdir -p ${DATA_ROOT}/stellar-core-horizon
chmod a+w ${DATA_ROOT}/stellar-core-horizon

mkdir -p $LOG_ROOT/fluentd
chmod a+w $LOG_ROOT/fluentd

# Influx as backend of the logging must be started first
docker-compose up -d influxdb
sleep 5
curl -POST 'http://localhost:8086/query' --data-urlencode "q=CREATE DATABASE logs_collector"

# Fluentd must connect to influx before the other services start to log to it
docker-compose up -d fluentd
sleep 2

# The rest is starting
docker-compose up -d

#!/bin/bash
INIT_INFLUX_DB=TRUE
INIT_HORIZON=TRUE
INIT_STELLAR_DB=TRUE

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

ROOTS=(${LOG_ROOT} ${DATA_ROOT})
CONTAINER_NAMES=$(cat docker-compose.yml | grep "container_name:" | awk '{print $2}' | sed -e 's/fox_//')

echo "Creating following writable directories:"
for ROOT in ${ROOTS[*]}; do
  for CONTAINER_NAME in ${CONTAINER_NAMES}; do
    DIRECTORY=${ROOT}/${CONTAINER_NAME}
    if [ ! -d "${DIRECTORY}" ]; then
      echo "- ${DIRECTORY}"
      mkdir -p ${DIRECTORY}
      chmod a+w ${DIRECTORY}
    fi
  done
done
echo "done."
echo "Influx as backend of the logging must be started first"
docker-compose up -d influxdb
sleep 2

if [ $INIT_INFLUX_DB == "TRUE" ]; then
  echo "Creating InfluxDB"
  curl -POST 'http://localhost:8086/query' --data-urlencode "q=CREATE DATABASE logs_collector"
fi

echo "Fluentd must connect to influx before the other services start to log to it"
docker-compose up -d fluentd
sleep 2

echo "The DBs backing core and horizon must be started before initialization"
docker-compose up -d horizon-db
docker-compose up -d stellar-core-db
sleep 5

if [ $INIT_STELLAR_DB == "TRUE" ]; then
  echo "Initializing stellar-core DB"
  docker run --network="compose_default" -v ${WORKSPACE}/etc/stellar-core.cfg:/etc/stellar-core.cfg -it stellar-core:latest /bin/bash -c "stellar-core --conf /etc/stellar-core.cfg --newdb"
fi

if [ $INIT_HORIZON == "TRUE" ]; then
  echo "Initializing horizon DB"
  docker run --network="compose_default" -it horizon:latest /bin/bash -c "horizon db init --db-url=\"dbname=horizon user=horizon password=horizon host=fox_horizon_db port=5432 sslmode=disable\""
fi

# The rest is starting
docker-compose up -d

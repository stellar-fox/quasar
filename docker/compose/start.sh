#!/bin/bash
INIT_INFLUX_DB=TRUE
INIT_HORIZON_DB=TRUE
INIT_STELLAR_DB=TRUE
INIT_FEDERATION_DB=TRUE

export STELLAR_ROOT=${1:-$STELLAR_HOME}
export TARGET=${2:-test}
export WORKSPACE=$STELLAR_ROOT/$TARGET
export SENSITIVE_CONFIG_ROOT=$WORKSPACE/etc
export CONFIG_ROOT=../etc
export DATA_ROOT=$WORKSPACE/data
export LOG_ROOT=$WORKSPACE/log
export USER_ME=$(id -u)
export GROUP_ME=$(id -g)
export DOMAIN=${DOMAIN:-"stellar-fox.net"}
export FULLY_QUALIFIED_DOMAIN_NAME=${FULLY_QUALIFIED_DOMAIN_NAME:-$DOMAIN}

ROOTS=(${LOG_ROOT} ${DATA_ROOT})
CONTAINER_NAMES=$(cat docker-compose.yml | grep "container_name:" | awk '{print $2}' | sed -e 's/fox_//')

echo "Template the nginx with FULLY_QUALIFIED_DOMAIN_NAME=$FULLY_QUALIFIED_DOMAIN_NAME="
find ../etc/nginx/conf.d/ -type f -name "*template" | xargs -I {} echo {} | sed 's/conf.template/conf/g' | xargs -I {} bash -c "sed 's/FULLY_QUALIFIED_DOMAIN_NAME/$FULLY_QUALIFIED_DOMAIN_NAME/g' {}.template > {}"

echo "Creating following writable directories:"
for ROOT in ${ROOTS[*]}; do
  for CONTAINER_NAME in ${CONTAINER_NAMES}; do
    DIRECTORY=${ROOT}/${CONTAINER_NAME}
    echo "...$DIRECTORY"
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
docker-compose up -d bridge-db
docker-compose up -d federation-db
sleep 5

echo ${SENSITIVE_CONFIG_ROOT}
if [ $INIT_STELLAR_DB == "TRUE" ]; then
  echo "Initializing stellar-core DB"
  docker run --network="compose_default" --rm -it -v ${SENSITIVE_CONFIG_ROOT}/stellar-core.cfg:/etc/stellar-core.cfg stellarfox/stellar-core:alpine-3.8-v10.0.0 /bin/bash -c "cat /etc/stellar-core.cfg; stellar-core --conf /etc/stellar-core.cfg --newdb"
  sleep 1
fi

if [ $INIT_HORIZON_DB == "TRUE" ]; then
  echo "Initializing horizon DB"
  docker run --network="compose_default" --rm -it stellarfox/horizon:ubuntu-18.04-v0.14.2 /bin/bash -c "horizon db init --db-url=\"dbname=horizon user=horizon password=horizon host=fox_horizon_db port=5432 sslmode=disable\""
  sleep 1
fi

if [ $INIT_FEDERATION_DB == "TRUE" ]; then
  echo "Initializing federation DB"
  docker run --network="compose_default" --rm -it -v ${SENSITIVE_CONFIG_ROOT}/bridge.cfg:/etc/bridge.cfg stellarfox/bridge:ubuntu-18.04-v0.0.31 /bin/bash -c "bridge --config /etc/bridge.cfg --migrate-db"
  sleep 1
fi

# The rest is starting
docker-compose up -d

docker ps

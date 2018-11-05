# quasar
Docker wrappers.  
Orchestrating.  

## prerequisities
docker

## Docker images

### builder
Builds the native application using cordova.  
```bash
$ cd docker/images/builder
$ ./build.sh
$ ./run.sh workspace_path input_project output_project
```
* workspace_path the parent directory where project to be wrapped is checked out  
* input_project the project to be wrapped  
* output_project the name of the project to be created as a wrapper  

### cygnus
Runs cygnus in the container
```bash
$ cd docker/images/cygnus  
$ ./build.sh  
$ ./run.sh config_path/config_to_be_used  
```

### deneb-db
Runs deneb database in the container
```bash
$ cd docker/images/deneb-db
$ ./build.sh
$ ./run.sh path_to_postgres_data
```
* path_to_postgres_data is created on the first use

### stellar-core
Contenerization of the stellar-core
```bash
$ cd docker/images/stellar-core
$ ./build.sh
```
Init the stellar-core-db postgres
```bash
$ docker run --network="compose_default" -v ${WORKSPACE}/etc/stellar-core.cfg:/etc/stellar-core.cfg -it stellar-core:latest /bin/bash -c "stellar-core --conf /etc/stellar-core.cfg --newdb"
```

### stellar-core-db
Dockerized postgres.
Must be initialized by stellar-core.
```bash
$ docker run --network="compose_default" -v ${WORKSPACE}/etc/stellar-core.cfg:/etc/stellar-core.cfg -it stellar-core:latest /bin/bash -c "stellar-core --conf /etc/stellar-core.cfg --newdb"
2018-11-05T18:05:37.282 GAHFE [Database INFO] Connecting to: postgresql://dbname=core user=core password=******** host=fox_stellar_core_db port=5432
2018-11-05T18:05:37.285 GAHFE [SCP INFO] LocalNode::LocalNode@GAHFE qSet: 273af2
NOTICE:  table "accounts" does not exist, skipping
NOTICE:  table "signers" does not exist, skipping
NOTICE:  table "offers" does not exist, skipping
NOTICE:  table "trustlines" does not exist, skipping
NOTICE:  table "peers" does not exist, skipping
NOTICE:  table "storestate" does not exist, skipping
NOTICE:  table "pubsub" does not exist, skipping
NOTICE:  table "ledgerheaders" does not exist, skipping
NOTICE:  table "txhistory" does not exist, skipping
NOTICE:  table "txfeehistory" does not exist, skipping
NOTICE:  table "publishqueue" does not exist, skipping
2018-11-05T18:05:38.667 GAHFE [Database INFO] Applying DB schema upgrade to version 2
NOTICE:  table "scphistory" does not exist, skipping
NOTICE:  table "scpquorums" does not exist, skipping
2018-11-05T18:05:38.850 GAHFE [Database INFO] Applying DB schema upgrade to version 3
NOTICE:  table "accountdata" does not exist, skipping
2018-11-05T18:05:38.909 GAHFE [Database INFO] Applying DB schema upgrade to version 4
NOTICE:  table "ban" does not exist, skipping
2018-11-05T18:05:39.017 GAHFE [Database INFO] Applying DB schema upgrade to version 5
2018-11-05T18:05:39.034 GAHFE [Database INFO] Applying DB schema upgrade to version 6
2018-11-05T18:05:39.050 GAHFE [Database INFO] Applying DB schema upgrade to version 7
NOTICE:  table "upgradehistory" does not exist, skipping
2018-11-05T18:05:39.217 GAHFE [default INFO] * 
2018-11-05T18:05:39.217 GAHFE [default INFO] * The database has been initialized
2018-11-05T18:05:39.217 GAHFE [default INFO] * 
2018-11-05T18:05:39.226 GAHFE [Ledger INFO] Established genesis ledger, closing
2018-11-05T18:05:39.226 GAHFE [Ledger INFO] Root account seed: SDHOAMBNLGCE2MV5ZKIVZAQD3VCLGP53P3OBSBI6UN5L5XZI5TKHFQL4
2018-11-05T18:05:39.259 GAHFE [default INFO] *
2018-11-05T18:05:39.259 GAHFE [default INFO] * The next launch will catchup from the network afresh.
2018-11-05T18:05:39.259 GAHFE [default INFO] *
2018-11-05T18:05:39.259 GAHFE [default INFO] Application destructing
2018-11-05T18:05:39.261 GAHFE [default INFO] Application destroyed

```

### horizon-db
Init postgres horizon db
```bash
$ docker run --network="compose_default" -it horizon:latest /bin/bash -c "horizon db init --db-url=\"dbname=horizon user=horizon password=horizon host=fox_horizon_db port=5432 sslmode=disable\""
```

## Stellar-Fox ecosystem
### Tree
Outside the repository structure, prepare the ecosystem etc subtree (data will be created on start): 
```bash
$ tree -L 2 stellar-fox/test
stellar-fox/test
├── data
│   ├── chronograf
│   ├── deneb-db
│   ├── grafana
│   ├── influxdb
│   └── kapacitor
└── etc
    ├── cygnus.js
    └── deneb.json
```

### Environmental variables
Point, where your data partition for stellar-fox will be:
```bash
echo "export STELLAR_HOME=$HOME/stellar-fox" >> ~/.bashrc
```
or if diskspace limited:
```bash
echo "export STELLAR_HOME=/mnt/sdb1/`whoami`/stellar-fox" >> ~/.bashrc
```

Run the ecosystem:
```bash
$ cd docker/compose
$ ./start.sh
```
or

```bash
$ cd docker/compose
$ ./start.sh workspace target
```
where:
* workspace (default: $HOME/stellar-fox)
* target (default: test)

You will be able to access the frontend services as follows:
* [Cygnus](http://127.0.0.1:8082) - Your bank
* [pgAdmin 4.0](http://127.0.0.1:8084) - The postgres web clinet
* [Chronograf](http://127.0.0.1:8888) - Containers/System monitoring dashboard
* [Grafana](http://127.0.0.1:8081) - Monitoring tool

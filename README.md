# quasar
Docker wrappers.  
Orchestrating.  

## prerequisities
### centos7
#### docker
Instructions set to be able to deploy to centos7
```bash
sudo -s

sudo yum update

sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

sudo yum-config-manager \
  --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
sudo yum-config-manager --disable docker-ce-edge
sudo yum list docker-ce --showduplicates | sort -r

sudo yum install \
  docker-ce-18.06.1.ce-3.el7 \
  git \
  ntp \
  vim \

sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo systemctl start ntpd
sudo systemctl start docker
sudo systemctl enable docker
sudo chkconfig docker on
```
#### ruby
Instructions set to be able to deploy to centos7
```bash
sudo gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -sSL https://get.rvm.io | sudo bash -s stable
sudo usermod -a -G rvm `whoami`
sudo yum install -y patch autoconf automake bison bzip2 gcc-c++ libffi-devel libtool patch readline-devel sqlite-devel zlib-devel glibc-headers glibc-devel openssl-devel
# Exit and reenter shell
exit

rvm install ruby
rvm use 2.5.1 --default
rvm gemset create stellar-fox
rvm use 2.5.1@stellar-fox --default
gem install influxdb --version '0.6.1'
gem install rubysl-open3 --version '2.0.0'
```
Instructions set to be able to deploy to ubuntu 18.04
```bash
sudo gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 7FCC7D46ACCC4CF8
curl -sSL https://get.rvm.io | sudo bash -s stable
sudo usermod -a -G rvm `whoami`
echo "source /etc/profile.d/rvm.sh" >> ~/.bashrc
# Exit and reenter shell
exit

rvm install ruby
rvm use 2.5.1 --default
rvm gemset create stellar-fox
rvm use 2.5.1@stellar-fox --default
gem install influxdb --version '0.6.1'
gem install rubysl-open3 --version '2.0.0'
```

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

## Backup
### Grafana
#### Data sources
Backup:
```bash
$ cd docker/compose
$ curl http://admin:admin@localhost:8081/api/datasources | jq . > ../etc/grafana/datasources/datasources.json
```
The dumped file represents the array of the datasources.
Some manual work to split to single datasources needs to be done as one file is per datasource and [] removed.

Restore:
```bash
$ curl -XPOST -i http://admin:admin@localhost:8081/api/datasources --data-binary @../etc/grafana/datasources/influx.json -H "Content-Type: application/json"
```

where:
* workspace (default: $HOME/stellar-fox)
* target (default: test)

You will be able to access the frontend services as follows:
* [Cygnus](http://127.0.0.1:8082) - Your bank
* [pgAdmin 4.0](http://127.0.0.1:8084) - The postgres web clinet
* [Chronograf](http://127.0.0.1:8888) - Containers/System monitoring dashboard
* [Grafana](http://127.0.0.1:8081) - Monitoring tool

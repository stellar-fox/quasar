# quasar
Orchestrating and monitoring the stellar ecosystem.  

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
#### node.js
Installation:
```bash
npm --version
sudo apt install npm
sudo npm install -g npx
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

## Stellar-Fox ecosystem
### Tree
Outside the repository structure, prepare the ecosystem etc subtree (data will be created on start): 
```bash
$ tree -L 2 stellar-fox/test
stellar-fox/test
├── data
└── etc
    ├── bridge.cfg
    ├── cygnus.js
    ├── deneb.json
    ├── federation.cfg
    └── stellar-core.cfg
```

### Environmental variables
Point, where your data partition for stellar-fox will be:
```bash
echo "export STELLAR_HOME=$HOME/stellar-fox" >> ~/.bashrc
echo "export HOSTNAME=hostname"
echo "export DOMAIN=${HOSTNAME}.fully.gualified.domain.name"
```
or if diskspace limited:
```bash
echo "export STELLAR_HOME=/mnt/sdb1/`whoami`/stellar-fox" >> ~/.bashrc
echo "export HOSTNAME=hostname"
echo "export DOMAIN=${HOSTNAME}.fully.gualified.domain.name"
```

### Operations:
[Gulp](https://gulpjs.com/) is used as a task manager.
Launch quasar:
```bash
# Clone repo
$ git clone https://github.com/stellar-fox/quasar.git
$ cd quasar
# Install dependencies
$ npm i
# Show the main tasks
$ gulp --tasks-simple
# Run
$ gulp quasar_first_run
```
Show the chain of subtasks:
```bash
# Show tasks as a tree
$ gulp -T

...

[05:08:14] └─┬ quasar_first_run
[05:08:14]   └─┬ <series>
[05:08:14]     ├─┬ quasar_build
[05:08:14]     │ └─┬ <parallel>
[05:08:14]     │   ├── cygnus_build
[05:08:14]     │   └── deneb_build
[05:08:14]     ├─┬ quasar_init
[05:08:14]     │ └─┬ <parallel>
[05:08:14]     │   ├─┬ influx_init
[05:08:14]     │   │ └─┬ <series>
[05:08:14]     │   │   ├── influxdb_config_show
[05:08:14]     │   │   ├── influxdb_dir
[05:08:14]     │   │   ├── influxdb_up
[05:08:14]     │   │   ├── influxdb_init
[05:08:14]     │   │   └── influxdb_rm
[05:08:14]     │   ├─┬ core_init
[05:08:14]     │   │ └─┬ <series>
[05:08:14]     │   │   ├── core_config_show
[05:08:14]     │   │   ├── core_dir
[05:08:14]     │   │   ├── core_db_up
[05:08:14]     │   │   ├── core_db_init
[05:08:14]     │   │   └── core_db_rm
[05:08:14]     │   ├─┬ bridge_init
[05:08:14]     │   │ └─┬ <series>
[05:08:14]     │   │   ├── bridge_config_show
[05:08:14]     │   │   ├── bridge_dir
[05:08:14]     │   │   ├── bridge_db_up
[05:08:14]     │   │   ├── bridge_db_init
[05:08:14]     │   │   └── bridge_db_rm
[05:08:14]     │   ├─┬ horizon_init
[05:08:14]     │   │ └─┬ <series>
[05:08:14]     │   │   ├── horizon_config_show
[05:08:14]     │   │   ├── horizon_dir
[05:08:14]     │   │   ├── horizon_db_up
[05:08:14]     │   │   ├── horizon_db_init
[05:08:14]     │   │   └── horizon_db_rm
[05:08:14]     │   ├── quasar_config_generate_logging_fluentd
[05:08:14]     │   ├── quasar_config_generate_policy_restart
[05:08:14]     │   └─┬ quasar_dir_prepare
[05:08:14]     │     └─┬ <series>
[05:08:14]     │       └── quasar_dir_prepare
[05:08:14]     └─┬ quasar_up
[05:08:14]       └─┬ <series>
[05:08:14]         └── quasar_up
```

Check the status or do the cleanup the docker unit can be used:
```bash
[05:08:14] ├── docker_check
[05:08:14] ├── docker_containers_status_running
[05:08:14] ├── docker_containers_status_all
[05:08:14] ├── docker_containers_kill
[05:08:14] ├── docker_containers_remove
[05:08:14] ├── docker_images_remove_dangling
[05:08:14] ├── docker_images_remove_all
[05:08:14] ├── docker_volumes_remove_dangling
[05:08:14] ├── docker_network_prune
[05:08:14] ├── docker_mounts_status
[05:08:14] ├─┬ docker_clean
[05:08:14] │ └─┬ <series>
[05:08:14] │   ├── docker_check
[05:08:14] │   ├── docker_containers_kill
[05:08:14] │   ├── docker_containers_remove
[05:08:14] │   ├── docker_images_remove_dangling
[05:08:14] │   ├── docker_volumes_remove_dangling
[05:08:14] │   └── docker_network_prune
```
Note, that the cleanup does not remove the persistant data on purpose.
You can find the persistant data in ${STELLAR_HOME}/${TARGET}/data.

## Backup
### Grafana
At the moment the dashboard deployment is not automated yet.

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

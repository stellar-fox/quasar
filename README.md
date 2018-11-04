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

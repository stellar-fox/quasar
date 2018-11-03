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


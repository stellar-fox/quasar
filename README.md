# quasar
Docker wrappers.  
Orchestrating.  

## prerequisities
docker

## Docker images

### builder
Builds the native application using cordova
```bash
$ cd docker/builder
$ ./build.sh
$ ./run.sh workspace_path
```
or
```bash
$ docker run -it -v `readlink -f ~/repositories`:/workspace -w /workspace builder:latest /bin/bash
```
or with usb to use adb to install the apk
```bash
docker run -it --privileged -p 5037 -v /dev/bus/usb:/dev/bus/usb -v `readlink -f ~/repositories`:/workspace -w /workspace builder:latest /bin/bash
```

Inside the container
```bash
$ cordova create fusion_android
$ cd fusion_android
$ cordova platform add android
$ cordova build
$ adb install /workspace/fusion_android/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Or outside the container
```
adb install `readlink -f ~/repositories/fusion_android/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
```

### cygnus
Runs cygnus in the container
```bash
$ cd docker/cygnus  
$ ./build.sh  
$ ./run.sh config_path/config_to_be_used  
```

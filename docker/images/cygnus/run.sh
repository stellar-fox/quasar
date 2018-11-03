#!/bin/bash
docker rm -f cygnus
docker run -d --name cygnus -v `readlink -f $1`:/cygnus/src/config.js cygnus:latest

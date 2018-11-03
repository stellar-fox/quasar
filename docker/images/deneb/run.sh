#!/bin/bash
docker rm -f deneb
docker run -d --name deneb -v `readlink -f $1`:/deneb/src/config/configuration.json deneb:latest

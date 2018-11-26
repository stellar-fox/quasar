#!/bin/bash
docker rm -f shambhala
docker run -d --name shambhala -v `readlink -f $1`:/shambhala/src/config.js shambhala:latest

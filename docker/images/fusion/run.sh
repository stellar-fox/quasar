#!/bin/bash
docker rm -f fusion
docker run -d --name fusion -v `readlink -f $1`:/fusion/src/fusion.js fusion:latest

#!/bin/bash
docker rm -f builder
docker run -d --name builder -v `readlink -f $1`:/workspace builder:latest

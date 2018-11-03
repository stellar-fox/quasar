#!/bin/bash
echo "Usage:"
echo "./run "
docker rm -f builder
WORKSPACE=`readlink -f $1`
INPUT=$2
OUTPUT=$3
docker run --name builder -e "in=$INPUT" -e "out=$OUTPUT" -e "HOME=/workspace" -u $UID -v $WORKSPACE:/workspace -w /workspace builder:latest /bin/bash -c "/files/buildscript.sh /workspace \$in \$out"

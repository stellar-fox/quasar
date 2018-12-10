#!/bin/bash
echo "Usage:"
echo "./run "
docker rm -f builder
WORKSPACE=`readlink -f ../../../..`
OUTPUT=fusion_build_`date +"%Y%m%d%H%M%S"`
echo $WORKSPACE
echo $OUTPUT
docker run \
    --name builder \
    -e "HOME=/workspace" -u $UID \
    -v $WORKSPACE:/workspace \
    -w /workspace \
    builder:latest /bin/bash -c \
"""
cd /workspace/shambhala
npm run clean
npm i
npm run build:lib
cd -
rm /workspace/fusion/src/lib/shambhala.client.js
ln -s /workspace/shambhala/dist.lib/shambhala.client.js /workspace/fusion/src/lib/shambhala.client.js
/workspace/quasar/docker/images/builder/files/buildscript.sh /workspace fusion fusion_build_`date +"%Y%m%d%H%M%S"` $FUSION_APP_DOMAIN
"""

#/bin/bash +xe
WORKSPACE=`readlink -f $1`
INPUT=$2
OUTPUT=$3

if [ ! -d "$WORKSPACE" ]; then
   echo "No valid workspace $WORKSPACE path provided"
   exit 1
fi

if [ ! -d "$WORKSPACE/$INPUT" ]; then
   echo "No input project $INPUT found in the workspace $WORKSPACE"
   exit 1
fi

if [ -d "$WORKSPACE/$OUTPUT" ]; then
   echo "Output directory $WORKSPACE/$OUTPUT in the workspace - please clean it. I do not want to assume to remove it automatically"
   exit 1
fi

echo "Building application $INPUT that is in $WORKSPACE"
cd $WORKSPACE/$INPUT
npm install
npm run build

echo "Creating the Cordova wrapper"
cd $WORKSPACE
cordova create $OUTPUT
cd $WORKSPACE/$OUTPUT
echo "Adding cordova android plugin"
cordova platform add android
rm -rf $WORKSPACE/$OUTPUT/www/*
cp -R $WORKSPACE/$INPUT/build $WORKSPACE/$OUTPUT/www/htdocs
cp /files/index.html $WORKSPACE/$OUTPUT/www/.
cordova build

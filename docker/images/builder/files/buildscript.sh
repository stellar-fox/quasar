#/bin/bash +xe
WORKSPACE=`readlink -f $1`
INPUT=$2
OUTPUT=$3
FUSION_APP_DOMAIN=$4

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
cordova plugin add cordova-plugin-httpd
#cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-zeroconf
cordova plugin add cordova-plugin-inappbrowser-popup-bridge
rm -rf $WORKSPACE/$OUTPUT/www/*
cp -R $WORKSPACE/$INPUT/build $WORKSPACE/$OUTPUT/www/htdocs
rsvg-convert $WORKSPACE/$OUTPUT/www/htdocs/static/media/logo.b82958dc.svg > $WORKSPACE/$OUTPUT/www/htdocs/static/media/logo.b82958dc.png
mkdir $WORKSPACE/$OUTPUT/res/android
rsvg-convert -w 36 -h 36 $WORKSPACE/$OUTPUT/www/htdocs/static/media/logo.b82958dc.svg > $WORKSPACE/$OUTPUT/res/android/ldpi.png
rsvg-convert -w 48 -h 48 $WORKSPACE/$OUTPUT/www/htdocs/static/media/logo.b82958dc.svg > $WORKSPACE/$OUTPUT/res/android/mdpi.png
rsvg-convert -w 72 -h 72 $WORKSPACE/$OUTPUT/www/htdocs/static/media/logo.b82958dc.svg > $WORKSPACE/$OUTPUT/res/android/hdpi.png
rsvg-convert -w 96 -h 96 $WORKSPACE/$OUTPUT/www/htdocs/static/media/logo.b82958dc.svg > $WORKSPACE/$OUTPUT/res/android/xhdpi.png
find $WORKSPACE/$OUTPUT/www/htdocs -type f | xargs -I{} sed -i 's/logo.b82958dc.svg/logo.b82958dc.png/g' {}
cp $WORKSPACE/quasar/docker/images/builder/files/index.html $WORKSPACE/$OUTPUT/www/.
cp $WORKSPACE/quasar/docker/images/builder/files/bootstrap.js $WORKSPACE/$OUTPUT/www/.
sed -i "s/FUSION_APP_DOMAIN/$FUSION_APP_DOMAIN/g" $WORKSPACE/$OUTPUT/www/bootstrap.js
mv $WORKSPACE/$OUTPUT/config.xml $WORKSPACE/$OUTPUT/config.old.xml
cp $WORKSPACE/quasar/docker/images/builder/files/config.xml $WORKSPACE/$OUTPUT/.
cordova build

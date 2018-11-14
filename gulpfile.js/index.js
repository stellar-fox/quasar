var gulp = require('gulp');
var HubRegistry = require('gulp-hub');
var hub = HubRegistry(['./tasks/*js']);

gulp.registry(hub);
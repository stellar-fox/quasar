const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const hub = HubRegistry(['./tasks/*.js', './units/*.js']);

gulp.registry(hub);
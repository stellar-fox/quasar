const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const hub = HubRegistry(['../units/*js']);

gulp.registry(hub);
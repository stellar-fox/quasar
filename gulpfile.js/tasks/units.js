let gulp = require('gulp');
let HubRegistry = require('gulp-hub');
let hub = HubRegistry(['../units/*js']);

gulp.registry(hub);
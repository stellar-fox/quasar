const
    gulp = require("gulp"),
    HubRegistry = require("gulp-hub"),
    hub = HubRegistry(["./tasks/*.js"])

gulp.registry(hub)
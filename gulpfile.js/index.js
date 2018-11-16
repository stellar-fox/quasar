const
    gulp = require("gulp"),
    HubRegistry = require("gulp-hub"),
    hub = HubRegistry(["./tasks/*.js", "./units/*.js"])

gulp.registry(hub)
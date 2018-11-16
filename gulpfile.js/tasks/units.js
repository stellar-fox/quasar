const
    gulp = require("gulp"),
    HubRegistry = require("gulp-hub"),
    hub = HubRegistry(["../units/*js"])

gulp.registry(hub)
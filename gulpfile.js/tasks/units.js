const
    gulp = require("gulp"),
    HubRegistry = require("gulp-hub"),
    hub = HubRegistry([
        "../units/monitoring/*js",
        "../units/stellar/*js",
        "../units/fox/*js",
        "../units/quasar.js"
    ])

gulp.registry(hub)
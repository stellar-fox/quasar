/**
 * Quasar.
 *
 * Gulp unit for cygnus.
 *
 * @module cygnus-lib
 * @license Apache-2.0
 */




const
    gulp = require("gulp"),
    docker_build = require("../../lib/utils").docker_build



    
// ...
const cygnus_build = (cb) => {
    docker_build("cygnus", "cygnus:latest", ".")
    cb()
}




// ...
gulp.task("cygnus_build", cygnus_build)
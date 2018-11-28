/**
 * Quasar.
 *
 * Gulp unit for fusion.
 *
 * @module fusion-lib
 * @license Apache-2.0
 */




const
    gulp = require("gulp"),
    docker_build = require("../../lib/utils").docker_build



    
// ...
const fusion_build = (cb) => {
    docker_build("fusion", "fusion:latest", ".")
    cb()
}




// ...
gulp.task("fusion_build", fusion_build)
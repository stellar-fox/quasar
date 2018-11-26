/**
 * Quasar.
 *
 * Gulp unit for shambhala.
 *
 * @module shambhala-lib
 * @license Apache-2.0
 */




const
    gulp = require("gulp"),
    docker_build = require("../lib/utils").docker_build



    
// ...
const shambhala_build = (cb) => {
    docker_build("shambhala", "shambhala:latest")
    cb()
}




// ...
gulp.task("shambhala_build", shambhala_build)
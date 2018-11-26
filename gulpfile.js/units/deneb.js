/**
 * Quasar.
 *
 * Gulp unit for deneb.
 *
 * @module deneb-lib
 * @license Apache-2.0
 */




const
    gulp = require("gulp"),
    docker_build = require("../lib/utils").docker_build



    
// ...
const deneb_build = (cb) => {
    docker_build("deneb", "deneb:latest")
    docker_build("deneb-db", "deneb-db:latest")
    cb()
}




// ...
gulp.task("deneb_build", deneb_build)
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
    config = require("../lib/utils").config,
    logger = require("../lib/utils").logger,
    child_process = require("child_process")




const build = (module, tag) => {
    const cmd =
        `docker build -f ${config.QUASAR_ROOT}/docker/images/${module}/Dockerfile -t ${tag} .`
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {env: config, stdio:[0,1,2]})
}



    
// ...
const deneb_build = (cb) => {
    build("deneb", "deneb:latest")
    build("deneb-db", "deneb-db:latest")
    cb()
}




// ...
gulp.task("deneb_build", deneb_build)
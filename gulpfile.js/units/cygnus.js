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
    argv = require("yargs").argv,
    config = require("../lib/utils").cfg(),
    child_process = require("child_process"),
    loglevel = (argv.loglevel === undefined) ? "info" : argv.loglevel,
    Log = require("log"),
    log = new Log(loglevel)




const build = (module, tag) => {
    const cmd =
        `docker build -f ${config.QUASAR_ROOT}/docker/images/${module}/Dockerfile -t ${tag} .`
    log.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {env: config, stdio:[0,1,2]})
}



    
// ...
function cygnus_build (cb) {
    build("cygnus", "latest")
    cb()
}




// ...
gulp.task("cygnus_build", cygnus_build)
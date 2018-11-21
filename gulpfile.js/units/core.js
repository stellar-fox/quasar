/**
 * Quasar.
 *
 * Gulp unit for stellar-core.
 *
 * @module gulp-stellar-core-lib
 * @license Apache-2.0
 */




const 
    gulp = require("gulp"),
    config = require("../lib/utils").cfg(),
    logger = require("../lib/utils").logger,
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    { series } = require("gulp"),
    { string } = require("@xcmats/js-toolbox")




// ...
let docker_compose_cmd_prefix =
    "docker-compose -f " +
    `${config.QUASAR_ROOT}/docker/compose/docker-compose.yml`




// ...
function core_db_up (cb) {
    const cmd = `${docker_compose_cmd_prefix} up -d stellar-core-db`
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 5000)
}




// ...
function core_db_rm (cb) {
    const cmd = `${docker_compose_cmd_prefix} rm stellar-core-db`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    logger.debug(out)
    cb()
}




// ...
function core_db_init (cb) {
    const
        init_cmd = string.quote("stellar-core --conf /etc/stellar-core.cfg --newdb"),
        cmd = `${docker_compose_cmd_prefix} run --rm  stellar-core /bin/bash -c ${init_cmd}`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    logger.debug(out)
    cb()
}




// ...
function core_config_show (cb) {
    const cmd = `${docker_compose_cmd_prefix} config`
    logger.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({ 
            "stellar-core-db": yaml.safeLoad(a)["services"]["stellar-core-db"],
            "stellar-core": yaml.safeLoad(a)["services"]["stellar-core"],
        })
    console.log(b)
    cb()
}




// ...
function core_dir (cb) {
    mkdirp(`${config["DATA_ROOT"]}/stellar-core/history`)
    mkdirp(`${config["DATA_ROOT"]}/stellar-core-db`)
    cb()
}




// ...
gulp.task("core_config_show", core_config_show)
gulp.task("core_init", series(core_config_show, core_dir, core_db_up, core_db_init, core_db_rm))
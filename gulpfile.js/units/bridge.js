/**
 * Quasar.
 *
 * Gulp unit for bridge.
 *
 * @module gulp-bridge-lib
 * @license Apache-2.0
 */




const
    gulp = require("gulp"),
    argv = require("yargs").argv,
    config = require("../lib/utils").cfg(),
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    { series } = require("gulp"),
    { string } = require("@xcmats/js-toolbox"),
    loglevel = (argv.loglevel === undefined) ? "info" : argv.loglevel,
    Log = require("log"),
    log = new Log(loglevel)




// ...
let docker_compose_cmd_prefix =
    "docker-compose -f " +
    `${config.QUASAR_ROOT}/docker/compose/docker-compose.yml`




// ...
function bridge_db_up (cb) {
    const cmd = `${docker_compose_cmd_prefix} up -d bridge-db`
    log.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, { env: config }).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 5000)
}




// ...
function bridge_db_rm (cb) {
    const cmd = `${docker_compose_cmd_prefix} rm bridge-db`
    log.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, { env: config }).toString()
    log.debug(out)
    cb()
}




// ...
function bridge_db_init (cb) {
    const cmd = `${docker_compose_cmd_prefix} run --rm  bridge /bin/bash -c `
        + string.quote("bridge --config /etc/bridge.cfg --migrate-db")
    log.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    log.debug(out)
    cb()
}




// ...
function bridge_config_show (cb) {
    const cmd = `${docker_compose_cmd_prefix} config`
    log.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, { "env": config }).toString(),
        b = yaml.safeDump({
            "bridge-db": yaml.safeLoad(a)["services"]["bridge-db"],
            "bridge": yaml.safeLoad(a)["services"]["bridge"],
        })
    log.debug(b)
    cb()
}




// ...
function bridge_dir (cb) {
    mkdirp(`${config["DATA_ROOT"]}/bridge/history`)
    mkdirp(`${config["DATA_ROOT"]}/bridge-db`)
    cb()
}




// ...
gulp.task("bridge_config_show", bridge_config_show)
gulp.task(
    "bridge_init",
    series(
        bridge_config_show,
        bridge_dir,
        bridge_db_up,
        bridge_db_init,
        bridge_db_rm
    )
)

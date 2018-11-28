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
    config = require("../../lib/utils").config,
    logger = require("../../lib/utils").logger,
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    { series } = require("gulp"),
    { string } = require("@xcmats/js-toolbox"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/stellar.yml`




// ...
const bridge_db_up = (cb) => {
    const cmd = `${compose_cmd} up -d bridge-db`
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, { env: config }).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 5000)
}




// ...
const bridge_db_rm = (cb) => {
    const cmd = `${compose_cmd} rm bridge-db`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, { env: config }).toString()
    logger.debug(out)
    cb()
}




// ...
const bridge_db_init = (cb) => {
    const cmd = `${compose_cmd} run --rm  bridge /bin/bash -c `
        + string.quote("bridge --config /etc/bridge.cfg --migrate-db")
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    logger.debug(out)
    cb()
}




// ...
const bridge_config_show = (cb) => {
    const cmd = `${compose_cmd} config`
    logger.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, { "env": config }).toString(),
        b = yaml.safeDump({
            "bridge-db": yaml.safeLoad(a)["services"]["bridge-db"],
            "bridge": yaml.safeLoad(a)["services"]["bridge"],
        })
    logger.debug(b)
    cb()
}




// ...
const bridge_dir = (cb) => {
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

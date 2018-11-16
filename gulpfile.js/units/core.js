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
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 4000)
}




// ...
function core_db_rm (cb) {
    const cmd = `${docker_compose_cmd_prefix} rm stellar-core-db`
    const a = child_process.execSync(cmd, {"env": config}).toString()
    console.log(a)
    cb()
}




// ...
function core_db_init (cb) {
    const 
        cmd = `${docker_compose_cmd_prefix} run --rm  stellar-core /bin/bash -c `
            + string.quote("stellar-core --conf /etc/stellar-core.cfg --newdb"),
        a = child_process.execSync(cmd, {
            env: { PATH: process.env.PATH, ...config },
        }).toString()
    console.log(a)
    cb()
}




// ...
function core_config_show (cb) {
    const 
        cmd = `${docker_compose_cmd_prefix} config`,
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
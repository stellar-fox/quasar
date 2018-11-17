const
    gulp = require("gulp"),
    config = require("../lib/utils").cfg(),
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    { series } = require("gulp"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/docker-compose.yml`




// ...
function horizon_db_up (cb) {
    const cmd = `${compose_cmd} up -d horizon-db`
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 4000)
}




// ...
function horizon_db_rm (cb) {
    const cmd = `${compose_cmd} rm horizon-db`
    const a = child_process.execSync(cmd, {"env": config}).toString()
    console.log(a)
    cb()
}




// ...
function horizon_db_init (cb) {
    const
        /* db_params = string.quote(string.quote([
            "dbname=horizon",
            "user=horizon",
            "password=horizon",
            "host=fox",
            "horizon_db",
            "port=5432",
            "sslmode=disable",
        ].join(string.space()))),
        init_cmd = string.quote(`horizon db init --db-url=${db_params}`),
        cmd = `${compose_cmd} run --rm  horizon /bin/bash -c ${init_cmd}`, */
        cmd = `${compose_cmd} run --rm  horizon /bin/bash -c `
            + "\"horizon db init --db-url=\\\"dbname=horizon user=horizon password=horizon host=fox_horizon_db port=5432 sslmode=disable\\\"\"",
        a = child_process.execSync(cmd, {
            env: { PATH: process.env.PATH, ...config },
        }).toString()
    console.log(a)
    cb()
}




// ...
function horizon_config_show (cb) {
    const
        cmd = `${compose_cmd} config`,
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({
            "horizon-db": yaml.safeLoad(a)["services"]["horizon-db"],
            "horizon": yaml.safeLoad(a)["services"]["horizon"],
        })
    console.log(b)
    cb()
}




// ...
function horizon_dir (cb) {
    mkdirp(`${config["DATA_ROOT"]}/horizon/history`)
    mkdirp(`${config["DATA_ROOT"]}/horizon-db`)
    cb()
}




// ...
gulp.task("horizon_config_show", horizon_config_show)
gulp.task("horizon_init", series(horizon_config_show, horizon_dir, horizon_db_up, horizon_db_init, horizon_db_rm))
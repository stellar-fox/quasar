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
const horizon_db_up = (cb) => {
    const cmd = `${compose_cmd} up -d horizon-db`
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 5000)
}




// ...
const horizon_db_rm = (cb) => {
    const cmd = `${compose_cmd} rm horizon-db`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    logger.debug(out)
    cb()
}




// ...
const horizon_db_init = (cb) => {
    const
        db_params = string.wrap([
            "dbname=horizon",
            "user=horizon",
            "password=horizon",
            "host=fox_horizon_db",
            "port=5432",
            "sslmode=disable",
        ].join(string.space()), "\\\"", "\\\""),
        init_cmd = string.quote(`horizon db init --db-url=${db_params}`),
        cmd = `${compose_cmd} run --rm  horizon /bin/bash -c ${init_cmd}`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    logger.debug(out)
    cb()
}




// ...
const horizon_config_show = (cb) => {
    const cmd = `${compose_cmd} config`
    logger.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({
            "horizon-db": yaml.safeLoad(a)["services"]["horizon-db"],
            "horizon": yaml.safeLoad(a)["services"]["horizon"],
        })
    console.log(b)
    cb()
}




// ...
const horizon_dir = (cb) => {
    mkdirp(`${config["DATA_ROOT"]}/horizon/history`)
    mkdirp(`${config["DATA_ROOT"]}/horizon-db`)
    cb()
}




// ...
gulp.task("horizon_config_show", horizon_config_show)
gulp.task("horizon_init", series(horizon_config_show, horizon_dir, horizon_db_up, horizon_db_init, horizon_db_rm))
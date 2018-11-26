const
    gulp = require("gulp"),
    config = require("../lib/utils").config,
    logger = require("../lib/utils").logger,
    Influx = require("influx"),
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    { series } = require("gulp"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/monitoring.yml`




// ...
const influxdb_up = (cb) => {
    const cmd = `${compose_cmd} up -d influxdb`
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 2000)
}




// ...
const influxdb_rm = (cb) => {
    const cmd = `${compose_cmd} rm influxdb`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    console.log(out)
    cb()
}




// ...
const influxdb_config_show = (cb) => {
    const cmd = `${compose_cmd} config`
    logger.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({ "influxdb": yaml.safeLoad(a)["services"]["influxdb"] })
    console.log(b)
    cb()
}




// ...
const influxdb_init = (cb) => {
    const influx = new Influx.InfluxDB({
        host: "localhost",
        port: 8086,
    })

    influx.getDatabaseNames()
        .then(names => {
            if (!names.includes("logs_collector")) {
                return influx.createDatabase("logs_collector")
            }
        })
    influx.getDatabaseNames().then(names => {
        logger.debug(names)})
    cb()
}




// ...
const influxdb_dir = (cb) => {
    mkdirp(`${config["DATA_ROOT"]}/influxdb`)
    cb()
}




// ...
gulp.task("influx_config_show", influxdb_config_show)
gulp.task("influx_init", series(influxdb_config_show, influxdb_dir, influxdb_up, influxdb_init, influxdb_rm))
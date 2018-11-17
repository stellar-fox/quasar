const
    gulp = require("gulp"),
    argv = require("yargs").argv,
    config = require("../lib/utils").cfg(),
    Influx = require("influx"),
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    { series } = require("gulp"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/docker-compose.yml`,
    loglevel = (argv.loglevel === undefined) ? "info" : argv.loglevel,
    Log = require("log"),
    log = new Log(loglevel)




// ...
function influxdb_up (cb) {
    const cmd = `${compose_cmd} up -d influxdb`
    log.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 2000)
}




// ...
function influxdb_rm (cb) {
    const cmd = `${compose_cmd} rm influxdb`
    log.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    console.log(out)
    cb()
}




// ...
function influxdb_config_show (cb) {
    const cmd = `${compose_cmd} config`
    log.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({ "influxdb": yaml.safeLoad(a)["services"]["influxdb"] })
    console.log(b)
    cb()
}




// ...
function influxdb_init (cb) {
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
        log.debug(names)})
    cb()
}




// ...
function influxdb_dir (cb) {
    mkdirp(`${config["DATA_ROOT"]}/influxdb`)
    cb()
}




// ...
gulp.task("influx_config_show", influxdb_config_show)
gulp.task("influx_init", series(influxdb_config_show, influxdb_dir, influxdb_up, influxdb_init, influxdb_rm))
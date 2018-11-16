const
    gulp = require("gulp"),
    config = require("../lib/utils").cfg(),
    Influx = require("influx"),
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    { series } = require("gulp"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/docker-compose.yml`




// ...
function influxdb_up (cb) {
    const cmd = `${compose_cmd} up -d influxdb`
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 2000)
}




// ...
function influxdb_rm (cb) {
    const cmd = `${compose_cmd} rm influxdb`
    child_process.execSync(cmd, {"env": config}).toString()
    cb()
}




// ...
function influxdb_config_show (cb) {
    const
        cmd = `${compose_cmd} config`,
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({ "influxdb": yaml.safeLoad(a)["services"]["influxdb"] })
    console.log(b)
    cb()
}




// ...
function influxdb_init (cb) {
    console.log("%j", config)
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
        console.log(names)})
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
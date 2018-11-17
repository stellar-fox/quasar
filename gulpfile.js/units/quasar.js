const
    gulp = require("gulp"),
    config = require("../lib/utils").cfg(),
    deep_clone = require("../lib/utils").deep_clone,
    child_process = require("child_process"),
    yaml = require("js-yaml"),
    fs = require("fs"),
    { series } = require("gulp"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/docker-compose.yml`




// ...
function quasar_up (cb) {
    const cmd = `${compose_cmd} up -d`
    child_process.execSync(cmd, {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 2000)
}




// ...
function quasar_down (cb) {
    const cmd = `${compose_cmd} down`
    child_process.execSync(cmd,  {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    cb()
}




// ...
function quasar_config_show (cb) {
    const
        cmd = `${compose_cmd} config`,
        a = child_process.execSync(cmd, {"env": config}).toString()
    console.log(a)
    cb()
}




// ...
function quasar_config_generate_logging_fluentd (cb) {
    const
        compose_main = yaml.safeLoad(fs.readFileSync(
            `${config["QUASAR_ROOT"]}/docker/compose/docker-compose.yml`,
            "utf8")),
        services = Object.keys(compose_main["services"]),
        monitoring_services = [
            "fluentd",
            "influxdb",
            "grafana",
            "telegraf",
            "chronograf",
            "kapacitor",
            "dns",
        ],
        monitored_services = [...services].filter(x => !monitoring_services.includes(x)),
        logging_fluentd_template  = yaml.safeLoad(fs.readFileSync(
            `${config["CONFIG_ROOT"]}/templates/logging.fluentd.yml`,
            "utf8")),
        logging_layer = monitored_services.map(
            service => {
                let r = {}
                r[service] = deep_clone(logging_fluentd_template)
                return r
            }
        )
    fs.writeFileSync(
        `${config["QUASAR_ROOT"]}/docker/compose/logging_fluentd.yml`,
        yaml.dump(logging_layer))
    cb()
}




// ...
gulp.task("quasar_config_show", quasar_config_show)
gulp.task("quasar_config_generate_logging_fluentd", quasar_config_generate_logging_fluentd)
gulp.task("quasar_init", gulp.parallel(
    "influx_init",
    "core_init",
    "bridge_init",
    "horizon_init"
))
gulp.task("quasar_up", series(quasar_config_show, quasar_up))
gulp.task("quasar_down", series(quasar_config_show, quasar_down))
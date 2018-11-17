const
    gulp = require("gulp"),
    argv = require("yargs").argv,
    config = require("../lib/utils").cfg(),
    deep_clone = require("../lib/utils").deep_clone,
    child_process = require("child_process"),
    yaml = require("js-yaml"),
    fs = require("fs"),
    { series } = require("gulp"),
    { string } = require("@xcmats/js-toolbox"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/docker-compose.yml`,
    log_fluentd = (argv.log2fluentd === undefined) ? false : true,
    restart_always = (argv.restartalways === undefined) ? false : true,
    loglevel = (argv.loglevel === undefined) ? "info" : argv.loglevel,
    Log = require("log"),
    log = new Log(loglevel)




// ...
function quasar_up (cb) {
    const
        log_switch = log_fluentd ? `-f ${config.QUASAR_ROOT}/docker/compose/logging_fluentd.yml` : "",
        restart_policy = restart_always ? `-f ${config.QUASAR_ROOT}/docker/compose/restart_policy.yml` : "",
        cmd = [
            compose_cmd,
            log_switch,
            restart_policy,
            "up -d",
        ].join(string.space())
    log.info(`Command:\n${cmd}\n`)
    const output = child_process.execSync(cmd, {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    log.debug(`Output:\n${output}\n`)
    // Lets give it some time to spawn it
    setTimeout(cb, 2000)
}




// ...
function quasar_down (cb) {
    const cmd = `${compose_cmd} down`
    log.info(`Command:\n${cmd}\n`)
    const output = child_process.execSync(cmd,  {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    log.debug(`Output:\n${output}\n`)
    cb()
}




// ...
function quasar_config_show (cb) {
    const cmd = `${compose_cmd} config`
    log.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    console.log(out)
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
            `${config["CONFIG_ROOT"]}/templates/logging_fluentd.yml`,
            "utf8")),
        logging_layer = monitored_services.reduce(
            (d, o) => {
                d[o] = deep_clone(logging_fluentd_template)
                return d
            }, {}
        )
    fs.writeFileSync(
        `${config["QUASAR_ROOT"]}/docker/compose/logging_fluentd.yml`,
        yaml.dump({
            version: "3",
            "services": logging_layer,
        }))
    cb()
}




// ...
function quasar_config_generate_policy_restart (cb) {
    const
        compose_main = yaml.safeLoad(fs.readFileSync(
            `${config["QUASAR_ROOT"]}/docker/compose/docker-compose.yml`,
            "utf8")),
        services = Object.keys(compose_main["services"]),
        restart_policy = { restart: "always" },
        restart_policy_layer = services.reduce(
            (d, o) => {
                d[o] = deep_clone(restart_policy)
                return d
            }, {}
        )
    fs.writeFileSync(
        `${config["QUASAR_ROOT"]}/docker/compose/restart_policy.yml`,
        yaml.dump({
            version: "3",
            "services": restart_policy_layer,
        }))
    cb()
}




// ...
gulp.task("quasar_config_show", quasar_config_show)
gulp.task("quasar_config_generate_logging_fluentd", quasar_config_generate_logging_fluentd)
gulp.task("quasar_config_generate_policy_restart", quasar_config_generate_policy_restart)
gulp.task("quasar_init", gulp.parallel(
    "influx_init",
    "core_init",
    "bridge_init",
    "horizon_init"
))
gulp.task("quasar_up", series(quasar_config_show, quasar_up))
gulp.task("quasar_down", series(quasar_config_show, quasar_down))
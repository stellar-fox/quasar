const
    gulp = require("gulp"),
    argv = require("yargs").argv,
    config = require("../lib/utils").config,
    logger = require("../lib/utils").logger,
    deep_clone = require("../lib/utils").deep_clone,
    child_process = require("child_process"),
    mkdirp = require("mkdirp"),
    yaml = require("js-yaml"),
    fs = require("fs"),
    { series } = require("gulp"),
    { string } = require("@xcmats/js-toolbox"),
    compose_cmd = [
        "docker-compose",
        `-f ${config.QUASAR_ROOT}/docker/compose/fox.yml`,
        `-f ${config.QUASAR_ROOT}/docker/compose/monitoring.yml`,
        `-f ${config.QUASAR_ROOT}/docker/compose/stellar.yml`,
    ].join(string.space()),
    log_fluentd = (argv.log2fluentd === undefined) ? false : true,
    restart_always = (argv.restartalways === undefined && !log_fluentd) ? false : true,
    log_switch = log_fluentd ? `-f ${config.QUASAR_ROOT}/docker/compose/logging_fluentd.yml` : "",
    restart_policy = restart_always ? `-f ${config.QUASAR_ROOT}/docker/compose/restart_policy.yml` : ""




// ...
const quasar_up = (cb) => {
    const cmd = [
        compose_cmd,
        log_switch,
        restart_policy,
        "up -d",
    ].join(string.space())
    logger.info(`Command:\n${cmd}\n`)
    const output = child_process.execSync(cmd, {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    logger.debug(`Output:\n${output}\n`)
    // Lets give it some time to spawn it
    setTimeout(cb, 2000)
}




// ...
const quasar_down = (cb) => {
    const cmd = `${compose_cmd} down`
    logger.info(`Command:\n${cmd}\n`)
    const output = child_process.execSync(cmd,  {
        env: { PATH: process.env.PATH, ...config },
    }).toString()
    logger.debug(`Output:\n${output}\n`)
    cb()
}




// ...
const quasar_config_show = (cb) => {
    const cmd = [
        compose_cmd,
        log_switch,
        restart_policy,
        "config",
    ].join(string.space())
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    console.log(out)
    cb()
}




// ...
const get_service_names = (config_path) => {
    const compose_config = yaml.safeLoad(fs.readFileSync(config_path, "utf8")),
        services = Object.keys(compose_config["services"])
    return services
}




// ...
const quasar_config_generate_logging_fluentd = (cb) => {
    const
        services_fox = get_service_names(`${config["QUASAR_ROOT"]}/docker/compose/fox.yml`),
        services_stellar = get_service_names(`${config["QUASAR_ROOT"]}/docker/compose/stellar.yml`),
        monitored_services = [...services_fox, ...services_stellar],
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
const quasar_config_generate_policy_restart = (cb) => {
    const
        services_fox = get_service_names(`${config["QUASAR_ROOT"]}/docker/compose/fox.yml`),
        services_stellar = get_service_names(`${config["QUASAR_ROOT"]}/docker/compose/stellar.yml`),
        services_monitoring = get_service_names(`${config["QUASAR_ROOT"]}/docker/compose/monitoring.yml`),
        services = [...services_fox, ...services_stellar, ...services_monitoring],
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
const quasar_dir_prepare = (cb) => {
    const services = [
        "chronograf",
        "grafana",
        "kapacitor",
        "nginx",
    ]
    services.map(
        (s) => mkdirp(`${config["DATA_ROOT"]}/${s}`)
    )
    cb()
}




// ...
gulp.task("quasar_config_show", quasar_config_show)
gulp.task("quasar_config_generate_logging_fluentd", quasar_config_generate_logging_fluentd)
gulp.task("quasar_config_generate_policy_restart", quasar_config_generate_policy_restart)
gulp.task("quasar_dir_prepare", series(quasar_dir_prepare))
gulp.task("quasar_init", gulp.parallel(
    "influx_init",
    "core_init",
    "bridge_init",
    "horizon_init",
    "quasar_config_generate_logging_fluentd",
    "quasar_config_generate_policy_restart",
    "quasar_dir_prepare",
))
gulp.task("quasar_up", series(quasar_up))
gulp.task("quasar_down", series(quasar_down))
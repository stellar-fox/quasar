const
    gulp = require("gulp"),
    config = require("../lib/utils").config,
    logger = require("../lib/utils").logger,
    child_process = require("child_process"),
    { series } = require("gulp"),
    yaml = require("js-yaml"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/monitoring.yml`




// ...
const nginx_up = (cb) => {
    const cmd = `${compose_cmd} up -d nginx`
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 2000)
}




// ...
const nginx_rm = (cb) => {
    const cmd = `${compose_cmd} rm nginx`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    console.log(out)
    cb()
}




// ...
const nginx_config_show = (cb) => {
    const cmd = `${compose_cmd} config`
    logger.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({ "nginx": yaml.safeLoad(a)["services"]["nginx"] })
    console.log(b)
    cb()
}




// ...
const nginx_init = (cb) => {
    const cmd = `find docker/etc/nginx/conf.d/ -type f -name "*template" | xargs -I {} echo {} | sed 's/conf.template/conf/g' | xargs -I {} bash -c "sed 's/FULLY_QUALIFIED_DOMAIN_NAME/${config["DOMAIN"]}}/g' {}.template > {}"`
    logger.info(`Command:\n${cmd}\n`)
    const
        out = child_process.execSync(cmd, {"env": config}).toString()
    console.log(out)
    cb()
}




gulp.task("nginx_config_show", nginx_config_show)
gulp.task("nginx_up", nginx_up)
gulp.task("nginx_rm", nginx_rm)
gulp.task("nginx_init", series(nginx_config_show, nginx_init))
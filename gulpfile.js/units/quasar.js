const
    gulp = require("gulp"),
    config = require("../lib/utils").cfg(),
    child_process = require("child_process"),
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
gulp.task("quasar_config_show", quasar_config_show)
gulp.task("quasar_up", series(quasar_config_show, quasar_up))
gulp.task("quasar_down", series(quasar_config_show, quasar_down))
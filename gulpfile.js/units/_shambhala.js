/**
 * Quasar.
 *
 * Gulp unit for shambhala.
 *
 * @module shambhala-lib
 * @license Apache-2.0
 */




const
    gulp = require("gulp"),
    docker_build = require("../lib/utils").docker_build,
    config = require("../lib/utils").config,
    logger = require("../lib/utils").logger,
    child_process = require("child_process"),
    yaml = require("js-yaml"),
    mkdirp = require("mkdirp"),
    { series } = require("gulp"),
    compose_cmd = `docker-compose -f ${config.QUASAR_ROOT}/docker/compose/fox.yml`




// ...
const shambhala_db_up = (cb) => {
    const cmd = `${compose_cmd} up -d shambhala-db`
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 5000)
}




// ...
const shambhala_db_rm = (cb) => {
    const cmd = `${compose_cmd} rm shambhala-db`
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    logger.debug(out)
    cb()
}




// ...
const shambhala_up = (cb) => {
    const cmd = [
        `${compose_cmd} up -d shambhala-db`,
        `${compose_cmd} up -d shambhala-server`,
        `${compose_cmd} up -d shambhala-client`,
    ].join(";")
    logger.info(`Command:\n${cmd}\n`)
    child_process.execSync(cmd, {"env": config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 5000)
}




// ...
const shambhala_rm = (cb) => {
    const cmd = [
        `${compose_cmd} rm shambhala-client`,
        `${compose_cmd} rm shambhala-server`,
        `${compose_cmd} rm shambhala-db`,
    ].join(";")
    logger.info(`Command:\n${cmd}\n`)
    const out = child_process.execSync(cmd, {"env": config}).toString()
    logger.debug(out)
    cb()
}



// ...
const shambhala_dir = (cb) => {
    mkdirp(`${config["DATA_ROOT"]}/shambhala-db`)
    cb()
}




// ...
const shambhala_db_init = async (cb) => {
    const
        { Client } = require("pg"),
        client = new Client({
            user: "shambhala",
            host: "localhost", // Look into port mapping
            database: "shambhala",
            password: "shambhala",
            port: 5531,
        }),
        fs = require("fs"),
        query_create_key_table = fs.readFileSync(
            `${config["QUASAR_ROOT"]}/docker/etc/shambhala/create_key_table.sql`,
            "utf8"),
        query_create_whitelist_table = fs.readFileSync(
            `${config["QUASAR_ROOT"]}/docker/etc/shambhala/create_whitelist_table.sql`,
            "utf8")
    await client.connect()
    client.query(query_create_key_table)
    client.query(query_create_whitelist_table)
    cb()
}




// ...
const shambhala_config_show = (cb) => {
    const cmd = `${compose_cmd} config`
    logger.info(`Command:\n${cmd}\n`)
    const
        a = child_process.execSync(cmd, {"env": config}).toString(),
        b = yaml.safeDump({
            "shambhala-db": yaml.safeLoad(a)["services"]["shambhala-db"],
            "shambhala": yaml.safeLoad(a)["services"]["shambhala"],
        })
    console.log(b)
    cb()
}



    
// ...
const shambhala_build = (cb) => {
    docker_build("shambhala", "shambhala:latest", `${config["QUASAR_ROOT"]}/docker/etc/shambhala/`)
    cb()
}




// ...
gulp.task("shambhala_build", shambhala_build)
gulp.task("shambhala_init", series(shambhala_config_show, shambhala_dir, shambhala_db_up, shambhala_db_init, shambhala_db_rm))
gulp.task("shambhala_up", shambhala_up)
gulp.task("shambhala_rm", shambhala_rm)
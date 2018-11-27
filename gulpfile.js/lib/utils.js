const
    checkEnv = require("check-env"),
    appRoot = require("app-root-path"),
    quasar_root = appRoot.path,
    child_process = require("child_process"),
    // objects
    config = (() => {
        checkEnv(["STELLAR_HOME", "DOMAIN", "HOSTNAME"])
        const
            STELLAR_ROOT = process.env.STELLAR_HOME,
            TARGET = "test",
            WORKSPACE = `${STELLAR_ROOT}/${TARGET}`

        return {
            "QUASAR_ROOT": quasar_root,
            "CONFIG_ROOT": `${quasar_root}/docker/etc`,
            "STELLAR_ROOT": STELLAR_ROOT,
            "TARGET": TARGET,
            "WORKSPACE": WORKSPACE,
            "SENSITIVE_CONFIG_ROOT": `${WORKSPACE}/etc`,
            "DATA_ROOT": `${WORKSPACE}/data`,
            "LOG_ROOT": `${WORKSPACE}/log`,
            "RUN_DIR": `${WORKSPACE}/run`,
            "DOMAIN": process.env.DOMAIN,
            "HOSTNAME": process.env.HOSTNAME,
            "USER_ME": process.geteuid().toString(),
            "GROUP_ME": process.getegid().toString(),
            "INGEST": "false",
        }
    })(),

    logger = (() => {
        const
            argv = require("yargs").argv,
            loglevel = (argv.loglevel === undefined) ? "info" : argv.loglevel,
            Log = require("log"),
            logger = new Log(loglevel)
        return logger
    })(),

    deep_clone = (dictionary) => JSON.parse(JSON.stringify(dictionary)),
    docker_build = (module, tag, context) => {
        const cmd =
            `docker build -f ${quasar_root}/docker/images/${module}/Dockerfile -t ${tag} ${context}`
        logger.info(`Command:\n${cmd}\n`)
        child_process.execSync(cmd, {env: config, stdio:[0,1,2]})
    }

module.exports = {
    config: config,
    logger: logger,
    deep_clone: deep_clone,
    docker_build: docker_build,
}

const
    checkEnv = require("check-env"),
    appRoot = require("app-root-path")

module.exports = {
    cfg: function () {
        checkEnv(["STELLAR_HOME", "DOMAIN", "HOSTNAME"])
        const
            STELLAR_ROOT = process.env.STELLAR_HOME,
            TARGET = "test",
            QUASAR_ROOT = appRoot.path,
            WORKSPACE = `${STELLAR_ROOT}/${TARGET}`

        return {
            "QUASAR_ROOT": QUASAR_ROOT,
            "CONFIG_ROOT": `${QUASAR_ROOT}/docker/etc`,
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
        }
    },
}

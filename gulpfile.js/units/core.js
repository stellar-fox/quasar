const gulp = require('gulp')
const config = require('../lib/utils').cfg()
const child_process = require("child_process");
const mkdirp = require('mkdirp');
const yaml = require('js-yaml');
const { series } = require('gulp');

const docker_compose_cmd = "docker-compose -f " + config['QUASAR_ROOT'] 
    + "/docker/compose/docker-compose.yml "

function core_db_up(cb) {
    const cmd = docker_compose_cmd + "up -d stellar-core-db"
    child_process.execSync(cmd, {'env': config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 4000)
}

function core_db_rm(cb) {
    const cmd = docker_compose_cmd + "rm stellar-core-db"
    const a = child_process.execSync(cmd, {'env': config}).toString()
    console.log(a)
    cb()
}

function core_db_init(cb) {
    const cmd = docker_compose_cmd
        + "run --rm  stellar-core /bin/bash -c \"stellar-core --conf /etc/stellar-core.cfg --newdb\""
    const a = child_process.execSync(cmd, {
            'env': Object.assign({}, { 'PATH': process.env.PATH }, config)
        }).toString()
    console.log(a)
    cb()
}

function core_config_show(cb) {
    const cmd = docker_compose_cmd + "config"
    const a = child_process.execSync(cmd, {'env': config}).toString()
    const b = yaml.safeDump({ 
        'stellar-core-db': yaml.safeLoad(a)['services']['stellar-core-db'],
        'stellar-core': yaml.safeLoad(a)['services']['stellar-core'] 
    })
    console.log(b)
    cb()
}

function core_dir(cb) {
    mkdirp(config['DATA_ROOT'] + '/stellar-core/history')
    mkdirp(config['DATA_ROOT'] + '/stellar-core-db')
    cb();
}

gulp.task('core_config_show', core_config_show)
gulp.task('core_init', series(core_config_show, core_dir, core_db_up, core_db_init, core_db_rm))
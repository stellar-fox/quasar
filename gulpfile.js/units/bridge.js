const gulp = require('gulp')
const config = require('../lib/utils').cfg()
const child_process = require("child_process");
const mkdirp = require('mkdirp');
const yaml = require('js-yaml');
const { series } = require('gulp');

const docker_compose_cmd = "docker-compose -f " + config['QUASAR_ROOT'] 
    + "/docker/compose/docker-compose.yml "

function bridge_db_up(cb) {
    const cmd = docker_compose_cmd + "up -d bridge-db"
    child_process.execSync(cmd, {'env': config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 4000)
}

function bridge_db_rm(cb) {
    const cmd = docker_compose_cmd + "rm bridge-db"
    const a = child_process.execSync(cmd, {'env': config}).toString()
    console.log(a)
    cb()
}

function bridge_db_init(cb) {
    const cmd = docker_compose_cmd
        + "run --rm  bridge /bin/bash -c "
        + "\"bridge --config /etc/bridge.cfg --migrate-db\""
    const a = child_process.execSync(cmd, {
            'env': Object.assign({}, { 'PATH': process.env.PATH }, config)
        }).toString()
    console.log(a)
    cb()
}

function bridge_config_show(cb) {
    const cmd = docker_compose_cmd + "config"
    const a = child_process.execSync(cmd, {'env': config}).toString()
    const b = yaml.safeDump({ 
        'bridge-db': yaml.safeLoad(a)['services']['bridge-db'],
        'bridge': yaml.safeLoad(a)['services']['bridge'] 
    })
    console.log(b)
    cb()
}

function bridge_dir(cb) {
    mkdirp(config['DATA_ROOT'] + '/bridge/history')
    mkdirp(config['DATA_ROOT'] + '/bridge-db')
    cb();
}

gulp.task('bridge_config_show', bridge_config_show)
gulp.task('bridge_init', series(bridge_config_show, bridge_dir, bridge_db_up, bridge_db_init, bridge_db_rm))
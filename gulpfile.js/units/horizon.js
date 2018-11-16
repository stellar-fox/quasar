const gulp = require('gulp')
const config = require('../lib/utils').cfg()
const child_process = require("child_process");
const mkdirp = require('mkdirp');
const yaml = require('js-yaml');
const { series } = require('gulp');

const docker_compose_cmd = "docker-compose -f " + config['QUASAR_ROOT'] 
    + "/docker/compose/docker-compose.yml "

function horizon_db_up(cb) {
    const cmd = docker_compose_cmd + "up -d horizon-db"
    child_process.execSync(cmd, {'env': config}).toString()
    // Lets give it some time to spawn it
    setTimeout(cb, 4000)
}

function horizon_db_rm(cb) {
    const cmd = docker_compose_cmd + "rm horizon-db"
    const a = child_process.execSync(cmd, {'env': config}).toString()
    console.log(a)
    cb()
}

function horizon_db_init(cb) {
    const cmd = docker_compose_cmd
        + "run --rm  horizon /bin/bash -c "
        + "\"horizon db init --db-url=\\\"dbname=horizon user=horizon password=horizon host=fox_horizon_db port=5432 sslmode=disable\\\"\""
    const a = child_process.execSync(cmd, {
            'env': Object.assign({}, { 'PATH': process.env.PATH }, config)
        }).toString()
    console.log(a)
    cb()
}

function horizon_config_show(cb) {
    const cmd = docker_compose_cmd + "config"
    const a = child_process.execSync(cmd, {'env': config}).toString()
    const b = yaml.safeDump({ 
        'horizon-db': yaml.safeLoad(a)['services']['horizon-db'],
        'horizon': yaml.safeLoad(a)['services']['horizon'] 
    })
    console.log(b)
    cb()
}

function horizon_dir(cb) {
    mkdirp(config['DATA_ROOT'] + '/horizon/history')
    mkdirp(config['DATA_ROOT'] + '/horizon-db')
    cb();
}

gulp.task('horizon_config_show', horizon_config_show)
gulp.task('horizon_init', series(horizon_config_show, horizon_dir, horizon_db_up, horizon_db_init, horizon_db_rm))
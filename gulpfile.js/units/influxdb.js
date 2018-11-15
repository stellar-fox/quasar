let gulp = require('gulp')
let config = require('../lib/utils').cfg()
let Influx = require('influx')
let child_process = require("child_process");
let mkdirp = require('mkdirp');
let yaml = require('js-yaml');
const { series } = require('gulp');

function influxdb_up(cb) {
    cmd = "docker-compose -f " + config['QUASAR_ROOT'] + "/docker/compose/docker-compose.yml up -d influxdb"
    child_process.execSync(cmd, {'env': config}).toString()
    //console.log(a)
    cb()
}

function influxdb_rm(cb) {
    cmd = "docker-compose -f " + config['QUASAR_ROOT'] + "/docker/compose/docker-compose.yml rm influxdb"
    child_process.execSync(cmd, {'env': config}).toString()
    //console.log(a)
    cb()
}

function influxdb_config(cb) {
    cmd = "docker-compose -f " + config['QUASAR_ROOT'] + "/docker/compose/docker-compose.yml config"
    a = child_process.execSync(cmd, {'env': config}).toString()
    b = yaml.safeDump({ 'influxdb': yaml.safeLoad(a)['services']['influxdb'] })
    console.log(b)
    cb()
}

function influxdb_init(cb) {
    console.log('%j', config)
    const influx = new Influx.InfluxDB({
        host: 'localhost',
        port: 8086
    })
    influx.getDatabaseNames()
    .then(names => {
      if (!names.includes('logs_collector')) {
        return influx.createDatabase('logs_collector');
      }
    })
    influx.getDatabaseNames().then(names => {
        console.log(names)})
    cb()
}

function influxdb_dir(cb) {
    mkdirp(config['DATA_ROOT'] + '/influxdb')
    cb();
}

gulp.task('bla', influxdb_config)
gulp.task('influx_init', series(influxdb_config, influxdb_dir, influxdb_up, influxdb_init, influxdb_rm))
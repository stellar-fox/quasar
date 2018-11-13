require 'yaml'
require 'open3'
require_relative '../lib/utils.rb'

namespace :bridge do
  desc 'Initialize the Bridge DB'
  task :init do
    config = ConfigDirectories.new.get()
    puts config

    # Until the logging layer not separated to docker-compose.logging-fluentd, those two need to be started
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d influxdb"
    system(config, cmd)
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d fluentd"
    system(config, cmd)
    sleep(2)

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d bridge-db"
    system(config, cmd)

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml config"
    stdout_str, stderr_str, status = Open3.capture3(config, cmd)

    puts YAML.dump(
      {
        'bridge' => YAML.load(stdout_str)['services']['bridge'],
        'bridge-db' => YAML.load(stdout_str)['services']['bridge-db']
      })
    sleep(2)

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml run bridge /bin/bash -c \"bridge --config /etc/bridge.cfg --migrate-db\""
    puts cmd
    system(config, cmd) 

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml stop bridge-db"
    system(config, cmd)

    # Until the logging layer not separated to docker-compose.logging-fluentd, those two need to be stopped in reversed order
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml stop fluentd"
    system(config, cmd)
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml stop influxdb"
    system(config, cmd)
  end
end


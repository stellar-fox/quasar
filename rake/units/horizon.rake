require 'yaml'
require 'open3'
require_relative '../lib/utils.rb'

namespace :horizon do
  desc 'Initialize the Stellar Core'
  task :init do
    config = ConfigDirectories.new.get()
    puts config

    # Until the logging layer not separated to docker-compose.logging-fluentd, those two need to be started
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d influxdb"
    system(config, cmd)
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d fluentd"
    system(config, cmd)
    sleep(2)

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d horizon-db"
    system(config, cmd)

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml config"
    stdout_str, stderr_str, status = Open3.capture3(config, cmd)

    puts YAML.dump(
      {
        'horizon' => YAML.load(stdout_str)['services']['horizon'],
        'horizon-db' => YAML.load(stdout_str)['services']['horizon-db']
      })
    sleep(2)

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml run horizon /bin/bash -c \"horizon db init --db-url=\\\"dbname=horizon user=horizon password=horizon host=fox_horizon_db port=5432 sslmode=disable\\\"\""
    puts cmd
    system(config, cmd) 

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml stop horizon-db"
    system(config, cmd)

    # Until the logging layer not separated to docker-compose.logging-fluentd, those two need to be stopped in reversed order
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml stop fluentd"
    system(config, cmd)
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml stop influxdb"
    system(config, cmd)
  end
end


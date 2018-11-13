require 'influxdb'
require 'yaml'
require 'open3'
require_relative '../lib/utils.rb'

namespace :influxdb do
  desc 'Initialize the db'
  task :init do
    config = ConfigDirectories.new.get()
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d influxdb"
    system(config, cmd)
    
    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml config"
    stdout_str, stderr_str, status = Open3.capture3(config, cmd)
    puts YAML.dump({'influxdb' => YAML.load(stdout_str)['services']['influxdb']})
    sleep(1)

    database    = 'logs_collector'
    influxdb = InfluxDB::Client.new(database)

    # Is not dropped if exists - no need to check
    influxdb.create_database('logs_collector')
    policy_name = 'autogen'
    duration = '1d'
    replication = 1
    shard_duration = '1h'
    influxdb.alter_retention_policy(policy_name, database, duration, replication, shard_duration: shard_duration)

    cmd = "docker-compose -f #{config['QUASAR_ROOT']}/docker/compose/docker-compose.yml stop influxdb"
    system(config, cmd)
  end
end

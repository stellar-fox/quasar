require_relative '../lib/utils.rb'

namespace :influxdb do
  desc 'Initialize the db'
  task :init do
    _config = ConfigDirectories.new.get()
    cmd = "docker-compose -f #{_config['QUASAR_ROOT']}/docker/compose/docker-compose.yml up -d influxdb"
    puts(cmd)
    system(_config, cmd)
  end
end

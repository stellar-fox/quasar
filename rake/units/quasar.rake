require 'yaml'
require_relative '../lib/utils.rb' 

namespace :quasar do
  desc 'Quasar orchiestrator'

  task :help do
    puts "Help"
  end

  desc 'Creating yaml layer to merge in compose'
  namespace :layer do
    desc 'Logging layer'
    namespace :logging do
      desc 'Logging to fluentd [SUT]'
      task :fluentd do
        config = ConfigDirectories.new.get()
        compose_main = YAML.load_file(config['QUASAR_ROOT'] + '/docker/compose/docker-compose.yml')
        services = compose_main['services'].keys()
        monitoring_services = ['fluentd', 'influxdb', 'grafana', 'telegraf', 'chronograf', 'capacitor']
        monitored_services = services - monitoring_services

        logging_fluentd_template = YAML.load_file(config['CONFIG_ROOT'] + '/templates/logging.fluentd.yml')

        # Deep copy
        logging_layer = Hash[monitored_services.map {|service| [service, Marshal.load(Marshal.dump(logging_fluentd_template['service']))]}]
        File.open(config['QUASAR_ROOT'] + '/docker/compose/logging_fluentd.yml', 'w') {|f| f.write(YAML.dump({'services' => logging_layer})) }
      end
    end
  end
end

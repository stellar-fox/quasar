#require(File.expand_path('../lib/utils.rb', File.dirname(__FILE__)))
require_relative '../lib/utils.rb' 
require 'fileutils'

namespace :quasar do
  desc 'Quasar orchiestrator'

  task :help do
    puts "Help"
  end

  desc 'Checks the basic environmental setup'
  task :prepare_compose_env_file do
    _config = ConfigDirectories.new.get()
    # https://docs.docker.com/compose/env-file/
    FileUtils.mkdir_p(_config['RUN_DIR'])
    File.open(_config['RUN_DIR'] + '/.env', 'w') do |file| 
      _config.each do |key, value|
        file.write("#{key}=#{value}\n")
      end
    end
  end
end

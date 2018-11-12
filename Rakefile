$QUASAR_HOME = File.expand_path(File.dirname(__FILE__))
Dir.glob('**/rake/tasks/*.rake').each { |r| load r }
Dir.glob('**/rake/units/*.rake').each { |r| load r }

desc "Help"
task :default => 'quasar:help'

desc "All steps"
task :all => ['quasar:help', 'quasar:precheck']

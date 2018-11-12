namespace :units do
  desc 'List available units'
  task :list do
    Dir.glob('rake/units/*').each do |unit|
      puts unit.split('/').last
    end
  end
end


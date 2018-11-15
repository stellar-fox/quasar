namespace :docker do
  desc 'Check if docker command is available'
  task :setup do
    sh 'which docker'
  end

  desc 'Clean up docker artifacts'
  task :clean => [ 'setup', 'kill_containers', 'remove_containers', 'remove_dangling_images', 'remove_dangling_volumes' ]

  desc 'Kill running containers'
  task :kill_containers do
    sh 'docker kill $(docker ps -q) || echo "no running containers to kill"'
  end

  desc 'Remove all containers'
  task :remove_containers do
    sh 'docker rm -f $(docker ps -qa) || echo "no containers to remove"'
  end

  desc 'Remove dangling images' 
  task :remove_dangling_images do
    sh 'docker rmi $(docker images --filter dangling=true -q) || echo "no dangling images to remove"'
  end

  desc 'Remove all images (When you are running out of diskspace??)'
  task :remove_all_images do
    sh 'docker rmi -f $(docker images -aq) || echo "no images to remove"'
  end

  desc 'Remove dangling volumes'
  task :remove_dangling_volumes do
    sh 'docker volume rm $(docker volume ls -qf dangling=true) || echo "no dangling volumes to remove"'
  end

  desc 'Remove all unused networks'
  task :prune_network do
    sh 'docker network prune -f || echo "no networks to be pruned"'
  end

  desc 'Status running containers'
  task :status_running do
    sh 'docker ps | (read -r; printf "%s\n" "$REPLY"; sort -k 1 )'
  end

  desc 'Status all containers'
  task :status_all do
    sh 'docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.RunningFor}}\t{{.Ports}}\t{{.Image}}\t{{.ID}}" | (read -r; printf "%s\n" "$REPLY"; sort -k 1 )'
  end

  desc 'Show container mounts'
  task :status_mounts do
    sh 'docker ps --format  "table {{.Names}}\t{{.Mounts}}" | (read -r; printf "%s\n" "$REPLY"; sort -k 1 )'
  end
end

const gulp = require('gulp')
const shell = require('gulp-shell')

// Kill running containers
gulp.task('docker_check', shell.task('which docker && docker --version && docker-compose --version'))

// Kill running containers
gulp.task('kill_containers', shell.task('docker kill $(docker ps -q) || echo "no running containers to kill"'))

// Remove all containers
gulp.task('remove_containers', shell.task('docker rm -f $(docker ps -qa) || echo "no containers to remove"'))

// Remove dangling images
gulp.task('remove_dangling_images', shell.task('docker rmi $(docker images --filter dangling=true -q) || echo "no dangling images to remove"'))

// Remove all images (When you are running out of diskspace??)
gulp.task('remove_all_images', shell.task('docker rmi -f $(docker images -aq) || echo "no images to remove"'))

// Remove dangling volumes
gulp.task('remove_dangling_volumes', shell.task('docker volume rm $(docker volume ls -qf dangling=true) || echo "no dangling volumes to remove"'))

// Remove all unused networks
gulp.task('prune_network', shell.task('docker network prune -f || echo "no networks to be pruned"'))

// Status running containers
gulp.task('status_running', shell.task('docker ps | (read -r; printf "%s\n" "$REPLY"; sort -k 1 )'))

// Status all containers
gulp.task('status_all', shell.task('docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.RunningFor}}\t{{.Ports}}\t{{.Image}}\t{{.ID}}" | (read -r; printf "%s\n" "$REPLY"; sort -k 1 )'))

// Show container mounts
gulp.task('status_mounts', shell.task('docker ps --format  "table {{.Names}}\t{{.Mounts}}" | (read -r; printf "%s\n" "$REPLY"; sort -k 1 )'))

// Status all containers
gulp.task('status_all', shell.task('docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.RunningFor}}\t{{.Ports}}\t{{.Image}}\t{{.ID}}" | (read -r; printf "%s\n" "$REPLY"; sort -k 3 )'))

// Clean up docker artifacts
gulp.task('clean', gulp.series('docker_check', 'kill_containers', 'remove_containers', 'remove_dangling_images', 'remove_dangling_volumes'))

// Default
gulp.task('default', gulp.series('docker_check'))
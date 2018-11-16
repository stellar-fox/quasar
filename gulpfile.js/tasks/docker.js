const
    gulp = require("gulp"),
    shell = require("gulp-shell"),
    { string } = require("@xcmats/js-toolbox"),
    sort_cmd = "(read -r; printf " + string.quote("%s\n") + " " + string.quote("$REPLY") + "; sort -k 1 )"
    printout_format
        = string.quote("table {{.Names}}\t{{.Status}}\t{{.RunningFor}}\t{{.Ports}}\t{{.Image}}\t{{.ID}}")
// ...


// Kill running containers
gulp.task("docker_check",
    shell.task("which docker && docker --version && docker-compose --version"))

// Status running containers
gulp.task("docker_containers_status_running",
    shell.task(`docker ps --format ${printout_format} | ${sort_cmd}`))

// Status all containers
gulp.task("docker_containers_status_all",
    shell.task(`docker ps -a --format ${printout_format} | ${sort_cmd}`))

// Kill running containers
gulp.task("docker_containers_kill",
    shell.task("docker kill $(docker ps -q) || echo "
        + string.quote("no running containers to kill")))

// Remove all containers
gulp.task("docker_containers_remove",
    shell.task("docker rm -f $(docker ps -qa) || echo "
        + string.quote("no containers to remove")))

// Remove dangling images
gulp.task("docker_images_remove_dangling",
    shell.task("docker rmi $(docker images --filter dangling=true -q) || echo "
        + string.quote("no dangling images to remove")))

// Remove all images (When you are running out of diskspace??)
gulp.task("docker_images_remove_all",
    shell.task("docker rmi -f $(docker images -aq) || echo "
        + string.quote("no images to remove")))

// Remove dangling volumes
gulp.task("docker_volumes_remove_dangling",
    shell.task("docker volume rm $(docker volume ls -qf dangling=true) || echo "
    + string.quote("no dangling volumes to remove")))

// Remove all unused networks
gulp.task("docker_network_prune",
    shell.task("docker network prune -f || echo "
        + string.quote("no networks to be pruned")))

// Show container mounts
gulp.task("docker_mounts_status",
    shell.task("docker ps --format "
        + string.quote("table {{.Names}}\t{{.Mounts}}")
        + ` | ${sort_cmd}`))

// Clean up docker artifacts
gulp.task("docker_clean",
    gulp.series(
        "docker_check",
        "docker_containers_kill",
        "docker_containers_remove",
        "docker_images_remove_dangling",
        "docker_volumes_remove_dangling",
        "docker_network_prune"
        ))
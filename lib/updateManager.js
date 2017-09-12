var projectManager = require("./projectManager.js");
var program = require('commander');
var p = require('child_process');

function UpdateManager() {
    var that = this;
    that.launchNpm = function (command, package, options, cwd) {
        return new Promise(function (resolve, reject) {
            var cmd = 'npm ' + command + ' ' + package;
            if (options) {
                cmd = cmd + ' ' + options.join(' ');
            }
            if (!cwd) {
                cwd = null;
            }
            console.log("Launch: " + cmd + " " + cwd);
            p.exec(cmd, {cwd: cwd}, function (err, stdout, stderr) {
                if (err) {
                    console.log("Process error: " + cmd, err);
                    reject(err);
                } else {
                    console.log(stdout, stderr);
                    resolve();
                }
            });
        });
    };
    that.update = function (project) {
        return new Promise(function (resolve, reject) {
            that.launchNpm("remove", "smash-js-serverless", ["--save"], project.path).then(function () {
                that.launchNpm("install", "smash-js-serverless", ["--save"], project.path).then(function () {
                    resolve();
                }, function (error) {
                    console.log("Failed to install smash-js-serveless.", error);
                    reject(error);
                });
            }, function (error) {
                console.log("Failed to remove smash-js-serveless.", error);
                reject(error);
            });
        });
    };
    that.selfUpdate = function () {
        return new Promise(function (resolve, reject) {
            that.launchNpm("remove", "smash-js-serverless", ["-g"], null).then(function () {
                that.launchNpm("install", "smash-js-serverless", ["-g"], null).then(function () {
                    resolve();
                }, function (error) {
                    console.log("Failed to install smash-js-serveless.", error);
                    reject(error);
                });
            }, function (error) {
                console.log("Failed to remove smash-js-serveless.", error);
                reject(error);
            });
        });
    };
    that.updateProject = function (name) {
        return new Promise(function (resolve, reject) {
            projectManager.getProjects(name).then(function (project) {
                that.update(project).then(function (results) {
                    console.log("Project is now up to date.");
                    resolve();
                }, function (error) {
                    console.log("Failed to launch project update: ", error);
                    reject(error);
                });
            }, function (error) {
                console.log("Failed to get project: " + name, error);
                reject(error);
            });
        });
    };
    that.updateProjects = function () {
        return new Promise(function (resolve, reject) {
            var projects = projectManager.getProjectsSync();
            var promises = [];
            for (var i = 0, length = projects.length; i < length; i++) {
                promises.push(that.update(projects[i]));
            }
            Promise.all(promises).then(function (results) {
                console.log("Projects are now up to date.");
                resolve();
            }, function (error) {
                console.log("Failed to launch projects update: ", error);
                reject(error);
            });
        });
    };
}

var updateManager = new UpdateManager();
program.command('project:update [name]')
        .description('update project')
        .action(function (name) {
            if (name) {
                updateManager.updateProject(name).then(function () {
                    console.log("Update project " + name + " success.");
                    process.exit(0);
                }, function (error) {
                    console.log("Update project " + name + " failed.", error);
                    process.exit(1);
                });
            } else {
                updateManager.updateProjects().then(function () {
                    console.log("Update all projects success.");
                    process.exit(0);
                }, function (error) {
                    console.log("Update all projects failed.", error);
                    process.exit(1);
                });
            }
        });
program.command('self-update')
        .description('self update')
        .action(function () {
            updateManager.selfUpdate().then(function () {
                console.log("self-update success.");
                process.exit(0);
            }, function (error) {
                console.log("self-update failed.", error);
                process.exit(1);
            });
        });
module.exports = updateManager;
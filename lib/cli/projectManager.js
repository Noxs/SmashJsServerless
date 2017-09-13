var program = require('commander');
var path = require('path');
const os = require('os');
var config = require('./config.js');
var npm = require('./utils/npm.js');
var dm = require("./dependenciesManager.js");
var dirm = require("./directoryManager.js");
var tm = require("./templateManager.js");
var um = require("./updateManager.js");

function ProjectManager() {
    const key = "projects.json";
    const file = path.resolve(path.join(config.getDir(), key));
    var that = this;

    var save = function (data) {
        return config.saveConfig(key, data);
    };

    that.addProject = function (name, dir, dependencies) {
        return new Promise(function (resolve, reject) {
            var projects = that.getProjectsSync();
            projects.push({name: name, path: path.resolve(dir), dependencies: dependencies});
            save(projects).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save projects.", error);
                reject(error);
            });
        });
    };
    that.removeProject = function (name) {
        return new Promise(function (resolve, reject) {
            var projects = that.getProjectsSync();
            for (var i = 0, length = projects.length; i < length; i++) {
                if (projects[i].name === name) {
                    projects.splice(i, 1);
                    break;
                }
            }
            save(projects).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save projects.", error);
                reject(error);
            });
        });
    };
    that.getProjects = function (name) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(that.getProjectsSync(name));
            } catch (error) {
                reject(error);
            }
        });
    };
    that.getProjectsSync = function (name) {
        var projects = config.loadConfigSync(key, file);
        if (name) {
            for (var i = 0, length = projects.length; i < length; i++) {
                if (projects[i].name === name) {
                    return projects[i];
                }
            }
            throw new Error("Project " + name + " not found.");
        } else {
            return projects;
        }
    };
    that.getCurrentProject = function () {
        return new Promise(function (resolve, reject) {
            try {
                resolve(that.getCurrentProjectSync());
            } catch (error) {
                reject(error);
            }
        });
    };
    that.getCurrentProjectSync = function () {
        var cwd = process.cwd();
        var projects = that.getProjectsSync();
        for (var i = 0, length = projects.length; i < length; i++) {
            if (projects[i].path === cwd) {
                return projects[i];
            }
        }
        throw new Error("Current directory is not a registered project.");
    };
}

var projectManager = new ProjectManager();
program.command('project:add <name> [dir]')
        .description('add project')
        .action(function (name, dir) {
            if (!dir) {
                dir = process.cwd();
            }
            dir = path.resolve(dir);
            projectManager.addProject(name, dir).then(function () {
                console.log("Project added: " + name + ' ' + dir);
                process.exit(0);
            }, function (error) {
                console.log("Failed to add project.", error);
                process.exit(1);
            });
        });
program.command('project:remove <name>')
        .description('remove project')
        .action(function (name) {
            projectManager.removeProject(name).then(function () {
                console.log("Project removed: " + name);
                process.exit(0);
            }, function (error) {
                console.log("Failed to remove project.", error);
                process.exit(1);
            });
        });
program.command('project:list')
        .description('list projects')
        .action(function () {
            projectManager.getProjects().then(function (projects) {
                if (projects.length === 0) {
                    console.log("No project registered.");
                    process.exit(0);
                } else {
                    console.log("Projects (" + projects.length + "):");
                    for (var i = 0, length = projects.length; i < length; i++) {
                        console.log("  -  " + projects[i].name + '     ' + projects[i].path);
                    }
                    process.exit(0);
                }
            }, function (error) {
                console.log("Failed to list projects: ", error);
                process.exit(1);
            });
        });

//move this
program.command('project:create <name> [dir]')
        .description('add project')
        .action(function (name, dir) {
            if (!dir) {
                dir = process.cwd();
            }
            dir = path.resolve(dir);
            var deps = dm.getDependenciesSync();
            projectManager.addProject(name, dir, deps).then(function () {
                npm.setup(name, dir).then(function () {
                    dirm.generateDirectories(dir).then(function () {
                        var promises = [];
                        promises.push(tm.copyTemplate(dir, "index"));
                        promises.push(tm.copyTemplate(dir, "config"));
                        promises.push(tm.copyTemplate(dir, "codebuild"));
                        Promise.all(promises).then(function () {
                            var dependencies = [];
                            for (var i = 0, length = deps.length; i < length; i++) {
                                dependencies.push(deps[i].name);
                            }
                            um.install(dependencies, dir).then(function () {
                                console.log("Project created.");
                                process.exit(0);
                            }, function (error) {
                                console.log("Failed to install dependencies.", error);
                                process.exit(1);
                            });
                        }, function (error) {
                            console.log("Failed to generate template.", error);
                            process.exit(1);
                        });
                    }, function (error) {
                        console.log("Failed to generate directories.", error);
                        process.exit(1);
                    });
                }, function (error) {
                    console.log("Failed to npm init.", error);
                    process.exit(1);
                });
            }, function (error) {
                console.log("Failed to add project.", error);
                process.exit(1);
            });
        });
module.exports = projectManager;
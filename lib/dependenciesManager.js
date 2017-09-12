var nconf = require('nconf');
var pm = require("./projectManager.js");
var um = require("./updateManager.js");
var program = require('commander');
var path = require('path');
const os = require('os');

function DependenciesManager() {
    const key = "dependencies";
    const file = path.resolve(path.join(os.homedir(), "dependencies.json"));
    var that = this;

    var loadData = function () {
        nconf.file(key, file);
        var projects = nconf.get(key);
        if (projects) {
            return projects;
        } else {
            return [];
        }
    };

    var saveData = function () {
        return new Promise(function (resolve, reject) {
            nconf.save(function (err) {
                if (err) {
                    console.log("Failed to save configuration.", err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    var installDependency = function (dependency, project) {
        return new Promise(function (resolve, reject) {
            um.launchNpm("remove", dependency.name, ["--save"], project.path).then(function () {
                um.launchNpm("install", dependency.name, ["--save"], project.path).then(function () {
                    resolve();
                }, function (error) {
                    console.log("Failed to install " + dependency.name + ".", error);
                    reject(error);
                });
            }, function (error) {
                console.log("Failed to remove " + dependency.name + ".", error);
                reject(error);
            });
        });
    };

    that.addDependency = function (name) {
        return new Promise(function (resolve, reject) {
            var deps = loadData();
            deps.push({name: name});
            nconf.set(key, deps);
            saveData().then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save dependencies.", error);
                reject(error);
            });
        });
    };

    that.removeDependency = function (name) {
        return new Promise(function (resolve, reject) {
            var deps = loadData();
            for (var i = 0, length = deps.length; i < length; i++) {
                if (deps[i].name === name) {
                    deps.splice(i, 1);
                    break;
                }
            }
            nconf.set(key, deps);
            saveData().then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save dependencies.", error);
                reject(error);
            });
        });
    };

    that.getDependencies = function (name) {
        return new Promise(function (resolve, reject) {
            var deps = loadData();
            if (name) {
                for (var i = 0, length = deps.length; i < length; i++) {
                    if (deps[i].name === name) {
                        resolve(deps[i]);
                        break;
                    }
                }
                reject(new Error("Dependency " + name + " not found."));
            } else {
                resolve(deps);
            }
        });
    };

    that.getDependenciesSync = function (name) {
        var deps = loadData();
        if (name) {
            for (var i = 0, length = deps.length; i < length; i++) {
                if (deps[i].name === name) {
                    return deps[i];
                    break;
                }
            }
            throw new Error("Dependency " + name + " not found.");
        } else {
            return deps;
        }
    };

    that.installDependenciesOnProject = function (projectName, depName) {
        return new Promise(function (resolve, reject) {
            if (projectName) {
                var projects = [];
                projects.push(pm.getProjectsSync(projectName));
            } else {
                var projects = pm.getProjectsSync();
            }
            if (depName) {
                var dependencies = [];
                dependencies.push(that.getDependenciesSync(depName));
            } else {
                var dependencies = that.getDependenciesSync();
            }
            var dependencies = that.getDependenciesSync();
            var promises = [];
            for (var i = 0, lengthi = projects.length; i < lengthi; i++) {
                for (var j = 0, lengthj = dependencies.length; j < lengthj; j++) {
                    promises.push(installDependency(dependencies[j], projects[i]));
                }
            }
            Promise.all(promises).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to isntall deps: ", error);
                reject();
            });
        });
    };

    that.installDependenciesOnProjects = function () {
        return new Promise(function (resolve, reject) {
            var projects = pm.getProjectsSync();
            var dependencies = that.getDependenciesSync();
            var promises = [];
            for (var i = 0, lengthi = projects.length; i < lengthi; i++) {
                for (var j = 0, lengthj = dependencies.length; j < lengthj; j++) {
                    promises.push(installDependency(dependencies[j], projects[i]));
                }
            }
            Promise.all(promises).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to isntall deps: ", error);
                reject();
            });
        });
    };

}

var dependenciesManager = new DependenciesManager();

program.command('dep:add <name>')
        .description('add dependency')
        .action(function (name) {
            dependenciesManager.addDependency(name).then(function () {
                console.log("Dependency added: " + name);
                process.exit(0);
            }, function (error) {
                console.log("Failed to add dependency.", error);
                process.exit(1);
            });
        });

program.command('dep:remove <name>')
        .description('remove dependency')
        .action(function () {
            dependenciesManager.removeDependency(name).then(function () {
                console.log("Dependency added: " + name);
                process.exit(0);
            }, function (error) {
                console.log("Failed to add dependency.", error);
                process.exit(1);
            });
        });

program.command('dep:list')
        .description('list dependencies')
        .action(function () {
            dependenciesManager.getDependencies().then(function (deps) {
                if (deps.length === 0) {
                    console.log("No dependencies registered.");
                    process.exit(0);
                } else {
                    console.log("Dependencies (" + deps.length + "):");
                    for (var i = 0, length = deps.length; i < length; i++) {
                        console.log("  -  " + deps[i].name);
                    }
                    process.exit(0);
                }
            }, function (error) {
                console.log("Failed to list dependencies: ", error);
                process.exit(1);
            });
        });

program.command('dep:install [project] [dependency]')
        .description('install one or many dependencies')
        .action(function (project, dependency) {
            if (project || dependency) {
                dependenciesManager.installDependenciesOnProject(project, dependency).then(function () {
                    console.log("Install " + project + " " + dependency + " success.");
                    process.exit(0);
                }, function (error) {
                    console.log("Install " + project + " " + dependency + " failed.", error);
                    process.exit(1);
                });
            } else {
                dependenciesManager.installDependenciesOnProjects().then(function () {
                    console.log("Install dependencies success.");
                    process.exit(0);
                }, function (error) {
                    console.log("Install dependencies failed.", error);
                    process.exit(1);
                });
            }
        });

module.exports = dependenciesManager;
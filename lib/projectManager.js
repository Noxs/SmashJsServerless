var program = require('commander');
var nconf = require('nconf');
var path = require('path');

function ProjectManager() {
    const key = "projects";
    const file = path.resolve(path.join(__dirname, "../projects.json"));
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
    that.addProject = function (name, dir) {
        return new Promise(function (resolve, reject) {
            var projects = loadData();
            projects.push({name: name, path: path.resolve(dir)});
            nconf.set(key, projects);
            saveData().then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save projects.", error);
                reject(error);
            });
        });
    };
    that.removeProject = function (name) {
        return new Promise(function (resolve, reject) {
            var projects = loadData();
            for (var i = 0, length = projects.length; i < length; i++) {
                if (projects[i].name === name) {
                    projects.splice(i, 1);
                    break;
                }
            }
            nconf.set(key, projects);
            saveData().then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save projects.", error);
                reject(error);
            });
        });
    };
    that.getProjects = function (name) {
        return new Promise(function (resolve, reject) {
            var projects = loadData();
            if (name) {
                for (var i = 0, length = projects.length; i < length; i++) {
                    if (projects[i].name === name) {
                        resolve(projects[i]);
                        break;
                    }
                }
                reject(new Error("Project " + name + " not found."));
            } else {
                resolve(projects);
            }
        });
    };
    that.getProjectsSync = function (name) {
        var projects = loadData();
        if (name) {
            for (var i = 0, length = projects.length; i < length; i++) {
                if (projects[i].name === name) {
                    return projects[i];
                    break;
                }
            }
            throw new Error("Project " + name + " not found.");
        } else {
            return projects;
        }
    };
    that.getCurrentProject = function () {
        return new Promise(function (resolve, reject) {
            var cwd = process.cwd();
            var projects = that.getProjectsSync();
            for (var i = 0, length = projects.length; i < length; i++) {
                if (projects[i].path === cwd) {
                    resolve(projects[i]);
                    return;
                }
            }
            reject(new Error("Current directory is not a registered project."));
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
program.command('project:add <name> <path>')
        .description('add project')
        .action(function (name, path) {
            projectManager.addProject(name, path).then(function () {
                console.log("Project added: " + name + ' ' + path);
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
        .description('list project')
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
//TODO
program.command('project:init <name>')
        .description('add project')
        .action(function (name, path) {
            projectManager.addProject(name, path).then(function () {
                console.log("Project added: " + name + ' ' + path);
                process.exit(0);
            }, function (error) {
                console.log("Failed to add project.", error);
                process.exit(1);
            });
        });
module.exports = projectManager;
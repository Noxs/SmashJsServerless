var program = require('commander');
var path = require('path');
const os = require('os');
var config = require('./config.js');
var mkdirp = require('mkdirp');
function DirectoryManager() {
    const key = "directories.json";
    const file = path.resolve(path.join(config.getDir(), key));
    const defaultDirs = [
        {name: "util"},
        {name: "controller"},
        {name: "database"}
    ];

    var that = this;
    var save = function (data) {
        return config.saveConfig(key, data);
    };
    that.addDirectory = function (name, dir) {
        return new Promise(function (resolve, reject) {
            var dirs = that.getDirectoriesSync();
            dirs.push({name: name, path: dir});
            save(dirs).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save directories.", error);
                reject(error);
            });
        });
    };
    that.removeDirectory = function (name) {
        return new Promise(function (resolve, reject) {
            var dirs = that.getDirectoriesSync();
            for (var i = 0, length = dirs.length; i < length; i++) {
                if (dirs[i].name === name) {
                    dirs.splice(i, 1);
                    break;
                }
            }
            save(dirs).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save directories.", error);
                reject(error);
            });
        });
    };
    that.getDirectories = function (name) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(that.getDirectoriesSync(name));
            } catch (error) {
                reject(error);
            }
        });
    };
    that.getDirectoriesSync = function (name) {
        var dirs = config.loadConfigSync(key, file);
        if (name) {
            for (var i = 0, length = dirs.length; i < length; i++) {
                if (dirs[i].name === name) {
                    return dirs[i];
                }
            }
            throw new Error("dir " + name + " not found.");
        } else {
            return dirs;
        }
    };
    that.generateDirectories = function (dir) {
        return new Promise(function (resolve, reject) {
            try {
                that.generateDirectoriesSync(dir);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
    that.generateDirectoriesSync = function (dir) {
        var dirs = that.getDirectoriesSync();
        for (var i = 0, length = dirs.length; i < length; i++) {
            mkdirp.sync(path.resolve(path.join(dir, dirs[i].path)));
        }
    };
    that.init = function () {
        return new Promise(function (resolve, reject) {
            var dirs = defaultDirs;
            var add = function (dirs) {
                var dir = dirs.shift();
                that.addDirectory(dir.name, dir.name).then(function () {
                    if (dirs.length > 0) {
                        add(dirs);
                    } else {
                        resolve();
                    }
                }, function (error) {
                    console.log("Failed to init directories.", error);
                    reject(error);
                });
            };
            add(dirs);
        });
    };
}

var directoryManager = new DirectoryManager();
program.command('dir:add <name> <dir>')
        .description('add directory')
        .action(function (name, dir) {
            directoryManager.addDirectory(name, dir).then(function () {
                console.log("Directory added: " + name + ' ' + dir);
                process.exit(0);
            }, function (error) {
                console.log("Failed to add directory.", error);
                process.exit(1);
            });
        });
program.command('dir:remove <name>')
        .description('remove directory')
        .action(function (name) {
            directoryManager.removeDirectory(name).then(function () {
                console.log("Directory removed: " + name);
                process.exit(0);
            }, function (error) {
                console.log("Failed to remove directory.", error);
                process.exit(1);
            });
        });
program.command('dir:list')
        .description('list directories')
        .action(function () {
            directoryManager.getDirectories().then(function (dirs) {
                if (dirs.length === 0) {
                    console.log("No directories registered.");
                    process.exit(0);
                } else {
                    console.log("Directories (" + dirs.length + "):");
                    for (var i = 0, length = dirs.length; i < length; i++) {
                        console.log("  -  " + dirs[i].name + '     ' + dirs[i].path);
                    }
                    process.exit(0);
                }
            }, function (error) {
                console.log("Failed to list directories: ", error);
                process.exit(1);
            });
        });
module.exports = directoryManager;
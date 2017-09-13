var p = require('child_process');
var path = require('path');

function Npm() {
    var that = this;
    //deprecate this
    var launchNpm = function (command, package, options, cwd) {
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
    //TODO load config file ??
    that.setup = function (name, dir) {
        return new Promise(function (resolve, reject) {
            dir = path.resolve(dir);
            var cmd = 'npm init --force';
            console.log("Launch: " + cmd + " " + path.resolve(dir));
            p.exec(cmd, {cwd: dir}, function (err, stdout, stderr) {
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
    that.install = function (package, global, dir) {
        return new Promise(function (resolve, reject) {
            //TODO
        });
    };
    that.updade = function (package, global, dir) {
        return new Promise(function (resolve, reject) {
            //TODO
        });
    };
    that.remove = function (package, global, dir) {
        return new Promise(function (resolve, reject) {
            //TODO
        });
    };
}

module.exports = new Npm();
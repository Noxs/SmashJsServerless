var program = require('commander');
var path = require('path');
const os = require('os');
var nconf = require('nconf');

function Config() {
    const baseDir = "SmashConfig";
    const package = "package.json";
    var that = this;
    that.getDir = function () {
        return path.resolve(path.join(os.homedir(), baseDir));
    };
    that.getPackage = function () {
        nconf.file(package, path.resolve(path.join(__dirname, "../../", package)));
        return nconf.get();
    };
    that.loadConfig = function (key, file) {
        return new Promise(function (resolve, reject) {
            nconf.file(key, file);
            var data = nconf.get(key);
            if (data) {
                resolve(data);
            } else {
                resolve([]);
            }
        });
    };
    that.loadConfigSync = function (key, file) {
        nconf.file(key, file);
        var data = nconf.get(key);
        if (data) {
            return data;
        } else {
            return [];
        }
    };
    that.saveConfig = function (key, data) {
        return new Promise(function (resolve, reject) {
            nconf.set(key, data);
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
}

var config = new Config();
program.command('config')
        .description('print config directory')
        .action(function () {
            console.log("Configuration directory: " + config.getDir());
        });
program.command('version')
        .description('print version')
        .action(function () {
            var package = config.getPackage();
            console.log("version: " + package.version);
        });
//TODO 
//make possible to change config directory

module.exports = config;
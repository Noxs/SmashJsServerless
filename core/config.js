var smash = require("../smash.js");
var nconf = require('nconf');
var path = require('path');
function smashConfig() {
    var that = this;
    const defaultFile = "/config.json";
    var file = null;
    var rootPath = null;
    var conf = null;
    that.load = function (extRootPath, extFile) {
        if (!extRootPath) {
            throw new Error("Config file path is required.");
        }
        rootPath = extRootPath;
        file = defaultFile;
        if (extFile) {
            file = extFile;
        }
        conf = nconf.file(path.resolve(rootPath + file));
        return that;
    };
    that.get = function () {
        return conf;
    };
}

smash.registerConfig(new smashConfig());
module.exports = smash.getConfig();

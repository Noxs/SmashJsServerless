var smash = require("../smash.js");
var nconf = require('nconf');
var path = require('path');
var execute = function () {
    var that = this;
    const defaultFile = "/config.json";
    that.file = null;
    that.rootPath = null;
    that.conf = null;
    return {
        load: function (rootPath, file) {
            if (!rootPath) {
                throw new Error("Config file path is required.");
            }
            that.rootPath = rootPath;
            that.file = defaultFile;
            if (file) {
                that.file = file;
            }
            that.conf = nconf.file(path.resolve(that.rootPath + that.file));
            return that;
        },
        get: function () {
            return that.conf;
        }
    };
};
var smashConfig = execute();
module.exports = smashConfig;
smash.registerConfig(smashConfig);
var smash = require("../smash.js");
var path = require('path');
function smashConfig() {
    var that = this;
    const defaultFile = "config.json";
    var file = null;
    var rootPath = null;
    var nconf = require('nconf');
    that.load = function (extRootPath, extFile) {
        if (!extRootPath) {
            throw new Error("Config file path is required.");
        }
        rootPath = extRootPath;
        file = defaultFile;
        if (extFile) {
            file = extFile;
        }
        nconf.file(path.resolve(path.join(rootPath, file)));
        return that;
    };
    that.get = function (keyword) {
        if (keyword) {
            return nconf.get(keyword);
        } else {
            return nconf;
        }
    };
}

module.exports = {
    build: function () {
        console.log("Load core build config");
        if (smash.getConfig() === null) {
            console.log("Load core register authorization");
            smash.registerConfig(new smashConfig());
        }
        console.log("Load core return config");
        return smash.getConfig();
    },
    get: function () {
        return smash.getConfig();
    }
};

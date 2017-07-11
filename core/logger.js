var smash = require("../smash.js");
function logger() {
    var that = this;
    var customConsole = console;
    that.log = function () {
        customConsole.log.apply(this, arguments);
        return that;
    };
    that.warn = function () {
        customConsole.warn.apply(this, arguments);
        return that;
    };
    that.error = function () {
        customConsole.error.apply(this, arguments);
        return that;
    };
    that.setConsole = function (extCustomConsole) {
        customConsole = extCustomConsole;
        return that;
    };
    that.getConsole = function () {
        return customConsole;
    };
}

module.exports = {
    build: function () {
        console.log("Load core build logger");
        if (smash.getLogger() === null) {
            console.log("Load core register logger");
            smash.registerLogger(new logger());
        }
        console.log("Load core return logger");
        return smash.getLogger();
    },
    get: function () {
        return smash.getLogger();
    }
};
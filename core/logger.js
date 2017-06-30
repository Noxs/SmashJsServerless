var smash = require("../smash.js");
var execute = function () {
    var that = this;
    that.customConsole = console;
    return {
        log: function () {
            that.customConsole.log.apply(this, arguments);
            return that;
        },
        warn: function () {
            that.customConsole.warn.apply(this, arguments);
            return that;
        },
        error: function () {
            that.customConsole.error.apply(this, arguments);
            return that;
        },
        setConsole: function (customConsole) {
            that.customConsole = customConsole;
            return that;
        },
        getConsole: function () {
            return that.customConsole;
        }
    };
};
var logger = execute();
module.exports = logger;
smash.registerLogger(logger);
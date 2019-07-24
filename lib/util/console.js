const _ = require('lodash');
const SPACER = ", ";

const LEVELS = [
    "info",
    "log",
    "deprecated",
    "warn",
    "error",
];
class Console {
    constructor(namespace = null) {
        this._namespace = namespace;
        //TODO for next major, remove this.codes
        this.codes = {
            badRequest: 400,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
            conflict: 409,
            internalServerError: 500,
            notImplemented: 501,
            serviceUnavailable: 502
        };
        this._verbose = {};
        Object.freeze(this.codes);
    }

    //FIX ME maybe remove for next major
    typeOf(...args) {
        return args.map(arg => {
            if (arg && typeof arg === "object") {
                return "Type " + typeof arg + " / Class " + arg.constructor.name + " given";
            } else {
                return "Type " + typeof arg + " given";
            }
        }).join(SPACER);
    }

    buildError(message, code) {
        const error = new Error(message);
        if (code) {
            error.statusCode = code;
        }
        return error;
    }

    verbose(options = {}) {
        this._verbose = options;
        return this;
    }

    namespace(namespace) {
        this._namespace = namespace;
        return this;
    }

    getPrefix(level) {
        if (this._namespace) {
            return this._namespace + " " + level + ": ";
        } else {
            return level + ": ";
        }
    }

    isVerbose(level) {
        if (this._verbose.level) {
            if (LEVELS.indexOf(level) >= LEVELS.indexOf(this._verbose.level)) {
                return true;
            } else {
                return false;
            }
        } else if (this._verbose[level] !== false) {
            return true;
        } else {
            return false;
        }
    }

    print(...args) {
        console.log(...args);
    }

    deprecated(...args) {
        if (this.isVerbose("deprecated")) {
            console.log(this.getPrefix("Deprecation"), ...args);
        }
    }

    log(...args) {
        if (this.isVerbose("log")) {
            console.log(this.getPrefix("Log"), ...args);
        }
    }

    debug(...args) {
        console.log(this.getPrefix("Debug"), ...args);
    }

    info(...args) {
        if (this.isVerbose("info")) {
            console.info(this.getPrefix("Info"), ...args);
        }
    }

    warn(...args) {
        if (this.isVerbose("warn")) {
            console.warn(this.getPrefix("Warn"), ...args);
        }
    }

    error(...args) {
        if (this.isVerbose("error")) {
            console.error(this.getPrefix("Error"), ...args);
        }
    }

    table(...args) {
        console.table(...args);
    }

    time(...args) {
        console.time(...args);
    }

    timeEnd(...args) {
        console.timeEnd(...args);
    }

    timeLog(...args) {
        console.timeLog(...args);
    }

    trace(...args) {
        console.trace(...args);
    }
}

module.exports = Console;

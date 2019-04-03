const _ = require('lodash');
const SPACER = ", ";
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
        Object.freeze(this.codes);
    }

    //FIX ME maybe remove for next major
    typeOf(...args) {
        return _.map(args, arg => {
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

    namespace(namespace) {
        this._namespace = namespace;
        return this;
    }

    getPrefix(level) {
        if (this._namespace) {
            return level + " in " + this._namespace + ": ";
        } else {
            return level + ": ";
        }
    }

    print(...args) {
        console.log(...args);
    }

    deprecated(...args) {
        console.log(this.getPrefix("Deprecation"), ...args);
    }

    log(...args) {
        console.log(this.getPrefix("Log"), ...args);
    }

    debug(...args) {
        console.debug(this.getPrefix("Debug"), ...args);
    }

    info(...args) {
        console.info(this.getPrefix("Info"), ...args);
    }

    warn(...args) {
        console.warn(this.getPrefix("Warn"), ...args);
    }

    error(...args) {
        console.error(this.getPrefix("Error"), ...args);
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

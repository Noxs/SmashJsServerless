
class Console {
    constructor(namespace = null) {
        this._namespace = namespace;
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

    typeOf(variable) {
        let string = typeof variable;
        if (variable && variable.constructor) {
            string += " / Class " + variable.constructor.name;
        }
        return "Type " + string + " given";
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
            return level + " " + this._namespace + ": ";
        } else {
            return level + ": ";
        }
    }

    print(...args) {
        console.log(...args);
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

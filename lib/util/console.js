
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
            return level + " " + this._namespace + " :";
        } else {
            return level + " :";
        }
    }

    print(...args) {
        console.log(...args);
    }

    log(...args) {
        Array.prototype.unshift.call(arguments, this.getPrefix("Log"));
        console.log(...args);
    }

    debug(...args) {
        Array.prototype.unshift.call(arguments, this.getPrefix("Debug"));
        console.debug(...args);
    }

    info(...args) {
        Array.prototype.unshift.call(arguments, this.getPrefix("Info"));
        console.info(...args);
    }

    warn(...args) {
        Array.prototype.unshift.call(arguments, this.getPrefix("Warn"));
        console.warn(...args);
    }

    error(...args) {
        Array.prototype.unshift.call(arguments, this.getPrefix("Error"));
        console.error(...args);
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

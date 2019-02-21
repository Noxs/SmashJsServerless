
class Console {
    constructor() {
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

    log() {
        Array.prototype.unshift.call(arguments, "Log: ");
        console.log.apply(null, arguments);
    }

    debug() {
        Array.prototype.unshift.call(arguments, "Debug: ");
        console.debug.apply(null, arguments);
    }

    info() {
        Array.prototype.unshift.call(arguments, "Info: ");
        console.info.apply(null, arguments);
    }

    warn() {
        Array.prototype.unshift.call(arguments, "Warn: ");
        console.warn.apply(null, arguments);
    }

    error() {
        Array.prototype.unshift.call(arguments, "Error: ");
        console.error.apply(null, arguments);
    }

    table() {
        console.table.apply(null, arguments);
    }

    time() {
        console.time.apply(null, arguments);
    }

    timeEnd() {
        console.timeEnd.apply(null, arguments);
    }

    timeLog() {
        console.timeLog.apply(null, arguments);
    }

    trace() {
        console.trace.apply(null, arguments);
    }
}

module.exports = Console;

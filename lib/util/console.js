
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

    debug() {
        console.debug.apply(null, ["Debug: "].concat(arguments));
    }

    log() {
        console.log.apply(null, ["Log: "].concat(arguments));
    }

    info() {
        console.info.apply(null, ["Info: "].concat(arguments));
    }

    warn() {
        console.warn.apply(null, ["Warn: "].concat(arguments));
    }

    error() {
        console.error.apply(null, ["Error: "].concat(arguments));
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

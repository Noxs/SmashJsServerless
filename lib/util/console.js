
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
            string += " " + variable.constructor.name;
        }
        return string + " given";
    }

    buildError(message, code) {
        const error = new Error(message);
        if (code) {
            error.statusCode = code;
        }
        return error;
    }

    log() {
        console.log.apply(null, arguments);
    }

    info() {
        console.info.apply(null, arguments);
    }

    warn() {
        console.warn.apply(null, arguments);
    }

    error() {
        console.error.apply(null, arguments);
    }
}

module.exports = Console;

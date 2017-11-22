
class Console {
    constructor() {
        Object.assign(this, console);
        this.codes.badRequest = 400;
        this.codes.unauthorized = 401;
        this.codes.forbidden = 403;
        this.codes.notFound = 404;
        this.codes.conflict = 409;
        this.codes.internalServerError = 500;
        this.codes.notImplemented = 501;
        this.codes.serviceUnavailable = 502;
        Objectfreeze(this.codes);
    }

    typeOf(variable) {
        let string = typeof variable;
        if (variable && variable.constructor) {
            string += " " + variable.constructor.name;
        }
        return string;
    }

    buildError(message, code) {
        const error = new Error(message);
        if (code) {
            error.statusCode = code;
        }
        return error;
    }
}

module.exports = Console;

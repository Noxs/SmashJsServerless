const _ = require('lodash');
const Logger = require('./smashLogger');
const SPACER = ", ";

const MESSAGES = {
    400: "Bad request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    500: "Internal Server Error",
    501: "Not Implemented",
    503: "Service Unavailable",
};

class SmashError extends Error {
    constructor(code, externalMessage) {
        super();
        this.code = code;
        this.externalMessage = externalMessage;
        this.logger = new Logger();
    }

    getMessageToPrint() {
        return _.get(this, "internalMessage", this.externalMessage);
    }

    get body() {
        return { code: this.code, error: this.externalMessage, requestId: this.requestId };
    }

    printError() {
        this.logger.error("Code: " + this.code + ", reason: " + this.getMessageToPrint());
        return this;
    }
}

class BadRequest extends SmashError {
    get body() {
        const tempBody = { code: this.code, error: this.externalMessage, requestId: this.requestId };
        if (this.details) {
            tempBody.details = this.details;
        }
        return tempBody;
    }

    printError() {
        this.logger.info("Code: " + this.code + ", reason: " + this.getMessageToPrint(), "Details: " + this.getDetails(this.details));
        return this;
    }

    getDetails(object) {
        if (typeof object === "object") {
            object = JSON.stringify(object);
        }
        return object ? object : "No details provided";
    }
}

class Unauthorized extends SmashError {

}

class Forbidden extends SmashError {

}

class NotFound extends SmashError {
    printError() {
        this.logger.info("Code: " + this.code + ", reason: " + this.getMessageToPrint());
        return this;
    }
}

class Conflict extends SmashError {
    printError() {
        this.logger.info("Code: " + this.code + ", reason: " + this.getMessageToPrint());
        return this;
    }
}

class InternalServerError extends SmashError {
    printError() {
        this.logger.error("Code: " + this.code + ", reason: " + this.getMessageToPrint());
        if (this.parentError) {
            this.logger.error("Parent error:", this.parentError, this.parentError.stack);
        }
        this.logger.trace();
        return this;
    }
}

class NotImplemented extends SmashError {

}

class ServiceUnavailable extends SmashError {

}

class SmashErrorFactory {
    constructor(logger = new Logger()) {
        this.logger = logger;
    }

    get Errors() {
        return {
            400: BadRequest,
            401: Unauthorized,
            403: Forbidden,
            404: NotFound,
            409: Conflict,
            500: InternalServerError,
            501: NotImplemented,
            503: ServiceUnavailable,
        }
    }

    getError(code) {
        return _.get(this.Errors, `${code}`, SmashError);
    }

    _createError(code, externalMessage) {
        const CustomError = this.getError(code);
        const error = new CustomError(code, externalMessage);
        error.logger = this.logger;
        return error;
    }

    _getResourceName(resource) {
        return _.get(resource, "name", "Resource");
    }

    _getResourceId(resource) {
        const primary = _.get(resource, "primary", "");
        const secondary = _.get(resource, "secondary", "");
        if (primary === "") {
            return "";
        } else if (secondary === "") {
            return " " + primary;
        } else {
            return " " + primary + " - " + secondary;
        }
    }

    badRequestError(externalMessage, details = null, internalMessage = null) {
        const CODE = 400;
        const error = this._createError(CODE, externalMessage);
        error.internalMessage = internalMessage ? internalMessage : externalMessage;
        error.details = details;
        return error;
    }

    unauthorizedError(internalMessage) {
        //TODO Improve external message
        const CODE = 401;
        const error = this._createError(CODE, MESSAGES[CODE]);
        error.internalMessage = internalMessage;
        return error;
    }

    forbiddenError(externalMessage, internalMessage) {
        const CODE = 403;
        const error = this._createError(CODE, externalMessage ? externalMessage : MESSAGES[CODE]);
        error.internalMessage = internalMessage ? internalMessage : externalMessage;
        return error;
    }

    notFoundError(resource, internalMessage = null) {
        const CODE = 404;
        const externalMessage = this._getResourceName(resource) + this._getResourceId(resource) + " not found";
        const error = this._createError(CODE, externalMessage);
        error.internalMessage = internalMessage ? internalMessage : externalMessage;
        return error;
    }

    conflictError(resource, internalMessage = null) {
        const CODE = 409;
        const externalMessage = this._getResourceName(resource) + this._getResourceId(resource) + " already exist";
        const error = this._createError(CODE, externalMessage);
        error.internalMessage = internalMessage ? internalMessage : externalMessage;
        return error;
    }

    internalServerError(internalMessage, parentError) {
        const CODE = 500;
        const error = this._createError(CODE, MESSAGES[CODE]);
        error.internalMessage = internalMessage;
        error.parentError = parentError;
        return error;
    }

    notImplementedError(internalMessage) {
        const CODE = 501;
        const error = this._createError(CODE, MESSAGES[CODE]);
        error.internalMessage = internalMessage;
        return error;
    }

    serviceUnavailableError(internalMessage) {
        const CODE = 503;
        const error = this._createError(CODE, MESSAGES[CODE]);
        error.internalMessage = internalMessage;
        return error;
    }

    //FIX ME to remove or not?
    get SmashError() {
        return SmashError;
    }

    //FIX ME keep it here or it's useless? (same function in console/logger object)
    typeOf(...args) {
        return _.map(args, arg => {
            if (arg && typeof arg === "object") {
                return "Type " + typeof arg + " / Class " + arg.constructor.name + " given";
            } else {
                return "Type " + typeof arg + " given";
            }
        }).join(SPACER);
    }

    isSmashError(error) {
        return error instanceof SmashError;
    }
}

module.exports = SmashErrorFactory;

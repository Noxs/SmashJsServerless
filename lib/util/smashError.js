const Logger = require('./smashLogger');
const SPACER = ", ";
const SLASH = /\/|\\/;
const DOT = ".";

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
		return this.internalMessage ? this.internalMessage : this.externalMessage;
	}

	get body() {
		const body = { code: this.code, error: this.externalMessage, requestId: this.requestId };
		if (this.details) {
			body.details = this.details;
		}
		return body;
	}

	printError() {
		this.logger.error("Code: " + this.code + ", reason: " + this.getMessageToPrint());
		return this;
	}
}

class TypeError extends Error {
	constructor(message, property) {
		super();
		if (arguments.length === 2) {
			this.message = message + SmashErrorFactory.typeOf(property);
		} else {
			this.message = message;
		}
	}
}

class ValueError extends Error {
	constructor(message, property) {
		super();
		if (arguments.length === 2) {
			this.message = message + SmashErrorFactory.valueOf(property);
		} else {
			this.message = message;
		}
	}
}

class BadRequest extends SmashError {
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
			this.logger.trace(this.parentError);
		}
		return this;
	}
}

class NotImplemented extends SmashError {

}

class ServiceUnavailable extends SmashError {

}

class SmashErrorFactory {
	constructor(namespace) {
		this.logger = new Logger(namespace);
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
		};
	}

	getError(code) {
		return this.Errors[code] ? this.Errors[code] : SmashError;
	}

	_createError(code, externalMessage) {
		const CustomError = this.getError(code);
		const error = new CustomError(code, externalMessage);
		error.logger = this.logger;
		return error;
	}

	_getResourceName(resource) {
		return resource && resource.name ? resource.name : "Resource";
	}

	_getResourceId(resource) {
		const primary = resource && resource.primary ? resource.primary : "";
		const secondary = resource && resource.secondary ? resource.secondary : "";
		if (primary === "") {
			return "";
		}
		if (secondary === "") {
			return " " + primary;
		}
		return " " + primary + " - " + secondary;
	}

	badRequestError(externalMessage, details = null, internalMessage = null) {
		const CODE = 400;
		const error = this._createError(CODE, externalMessage);
		error.internalMessage = internalMessage ? internalMessage : externalMessage;
		error.details = details;
		return error;
	}

	isBadRequestError(error) {
		return error instanceof BadRequest;
	}

	unauthorizedError(internalMessage) {
		const CODE = 401;
		const error = this._createError(CODE, MESSAGES[CODE]);
		error.internalMessage = internalMessage;
		return error;
	}

	isUnauthorizedError(error) {
		return error instanceof Unauthorized;
	}

	forbiddenError(externalMessage, details = null, internalMessage = null) {
		const CODE = 403;
		const error = this._createError(CODE, externalMessage ? externalMessage : MESSAGES[CODE]);
		error.internalMessage = internalMessage ? internalMessage : externalMessage;
		error.details = details;
		return error;
	}

	isForbiddenError(error) {
		return error instanceof Forbidden;
	}

	notFoundError(resource, internalMessage = null) {
		const CODE = 404;
		const externalMessage = this._getResourceName(resource) + this._getResourceId(resource) + " not found";
		const error = this._createError(CODE, externalMessage);
		error.internalMessage = internalMessage ? internalMessage : externalMessage;
		return error;
	}

	isNotFoundError(error) {
		return error instanceof NotFound;
	}

	conflictError(resource, internalMessage = null) {
		const CODE = 409;
		const externalMessage = this._getResourceName(resource) + this._getResourceId(resource) + " already exist";
		const error = this._createError(CODE, externalMessage);
		error.internalMessage = internalMessage ? internalMessage : externalMessage;
		return error;
	}

	isConflictError(error) {
		return error instanceof Conflict;
	}

	internalServerError(internalMessage, parentError) {
		const CODE = 500;
		const error = this._createError(CODE, MESSAGES[CODE]);
		error.internalMessage = internalMessage;
		error.parentError = parentError;
		return error;
	}

	isInternalServerError(error) {
		return error instanceof InternalServerError;
	}

	notImplementedError(internalMessage) {
		const CODE = 501;
		const error = this._createError(CODE, MESSAGES[CODE]);
		error.internalMessage = internalMessage;
		return error;
	}

	isNotImplementedError(error) {
		return error instanceof NotImplemented;
	}

	serviceUnavailableError(internalMessage) {
		const CODE = 503;
		const error = this._createError(CODE, MESSAGES[CODE]);
		error.internalMessage = internalMessage;
		return error;
	}

	isServiceUnavailableError(error) {
		return error instanceof ServiceUnavailable;
	}

	get TypeError() {
		return TypeError;
	}

	get ValueError() {
		return ValueError;
	}

	get SmashError() {
		return SmashError;
	}

	typeOf(...args) {
		return args.map(arg => {
			if (arg && typeof arg === "object") {
				return "type '" + typeof arg + "' / class '" + arg.constructor.name + "' given";
			}
			return "type " + typeof arg + " given";
		}).join(SPACER);
	}

	static typeOf(...args) {
		return args.map(arg => {
			if (arg && typeof arg === "object") {
				return "type '" + typeof arg + "' / class '" + arg.constructor.name + "' given";
			}
			return "type " + typeof arg + " given";
		}).join(SPACER);
	}

	valueOf(...args) {
		return args.map(arg => {
			if (arg && typeof arg === "object") {
				return "value '" + JSON.stringify(arg) + "' given";
			}
			return "value '" + arg + "' given";
		}).join(SPACER);
	}

	static valueOf(...args) {
		return args.map(arg => {
			if (arg && typeof arg === "object") {
				return "value '" + JSON.stringify(arg) + "' given";
			}
			return "value '" + arg + "' given";
		}).join(SPACER);
	}

	isSmashError(error) {
		return error instanceof SmashError;
	}

	static isSmashError(error) {
		return error instanceof SmashError;
	}

	static stack() {
		const prepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = (_, stack) => stack;
		const stack = new Error().stack;
		while (stack[0].getFileName().indexOf("smashError.js") >= 0) {
			stack.shift();
		}
		if (stack[0].getFileName().indexOf("smash.js") >= 0) {
			stack.shift();
		}
		Error.prepareStackTrace = prepareStackTrace;
		return stack;
	}

	static lastFileName() {
		const [file] = this.stack();
		return file.getFileName();
	}

	static getNamespace() {
		const file = this.lastFileName();
		const namespace = file.split(SLASH).pop().split(DOT).shift();
		return namespace[0].toUpperCase() + namespace.slice(1);
	}
}

module.exports = SmashErrorFactory;

const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class Response {
	constructor(terminate, request) {
		if (typeof terminate !== 'object') {
			throw new errorUtil.TypeError("First parameter of new Response() must be a object, ", terminate);
		}
		if (typeof terminate.handleResponse !== 'function') {
			throw new errorUtil.TypeError("First parameter of new Response() must be a object with a function called handleResponse, ", terminate.handleResponse);
		}
		if (terminate.handleResponse.length !== 1) {
			throw new Error("First parameter of new Response() must be a function witch takes 1 parameter, " + terminate.handleResponse.length + " given");
		}
		if (typeof terminate !== 'object') {
			throw new errorUtil.TypeError("Second parameter of new Response() must be a object, ", terminate);
		}
		this._terminate = terminate;
		this.request = request;
		this.code = null;
		this.headers = {};
		this.body = null;
	}

	get _errorPointer() {
		return {
			400: this.badRequest,
			401: this.unauthorized,
			403: this.forbidden,
			404: this.notFound,
			409: this.conflict,
			500: this.internalServerError,
			501: this.notImplemented,
			503: this.serviceUnavailable,
		};
	}

	_cleanAndAssign(body) {
		return new Promise((resolve, reject) => {
			if (smash.filter.hasOutRule(this.request.route) === true) {
				smash.filter.cleanOut(this.request.route, body).then(resolve).catch(reject);
			} else {
				reject(this.internalServerError("No outRule found for " + JSON.stringify(this.request.route) + ", did you call cleanOk or cleanCreated without defining a outRule?"));
			}
		});
	}

	cleanOk(body) {
		this._cleanAndAssign(body).then(cleanedBody => {
			this.ok(cleanedBody);
		}).catch(error => {
			this.handleError(error);
		});
	}

	ok(body) {
		return this._handleResponse(200, body);
	}

	created(body) {
		return this._handleResponse(201, body);
	}

	cleanCreated(body) {
		this._cleanAndAssign(body).then(cleanedBody => {
			this.created(cleanedBody);
		}).catch(error => {
			this.handleError(error);
		});
	}

	accepted() {
		return this._handleResponse(202);
	}

	noContent() {
		return this._handleResponse(204);
	}

	_getRedirectHeaders(url) {
		return { Location: url };
	}

	movedPermanently(url) {
		return this._handleResponse(301, "", this._getRedirectHeaders(url));
	}

	found(url) {
		return this._handleResponse(302, "", this._getRedirectHeaders(url));
	}

	temporaryRedirect(url) {
		return this._handleResponse(307, "", this._getRedirectHeaders(url));
	}

	permanentRedirect(url) {
		return this._handleResponse(308, "", this._getRedirectHeaders(url));
	}

	badRequest(message, details) {
		return this.handleError(errorUtil.badRequestError(message, details));
	}

	unauthorized(message) {
		return this.handleError(errorUtil.unauthorizedError(message));
	}

	forbidden(message) {
		return this.handleError(errorUtil.forbiddenError(message));
	}

	notFound(message) {
		return this.handleError(errorUtil.notFoundError(message));
	}

	conflict(message) {
		return this.handleError(errorUtil.conflictError(message));
	}

	internalServerError(message, parentError = null, details = null) {
		return this.handleError(errorUtil.internalServerError(message, parentError, details));
	}

	notImplemented(message) {
		return this.handleError(errorUtil.notImplementedError(message));
	}

	serviceUnavailable(message) {
		return this.handleError(errorUtil.serviceUnavailableError(message));
	}

	forward(response) {
		return this._handleResponse(response.statusCode, response.body);
	}

	_handleResponse(code, body = "", headers = null) {
		this.code = code;
		this.body = body;
		this.addHeaders(headers);
		this.terminate();
		return this;
	}

	handleError(error) {
		if (errorUtil.isSmashError(error) === false) {
			error = errorUtil.internalServerError("First argument of handleError(error) must be a SmashError, " + errorUtil.typeOf(error), error);
		}
		error.requestId = this.request.requestId;
		error.printError();
		return this._handleResponse(error.code, error.body);
	}

	addHeader(key, value) {
		this.headers[key] = value;
		return this;
	}

	addHeaders(headers = {}) {
		for (const key in headers) {
			this.addHeader(key, headers[key]);
		}
		return this;
	}

	get stringifiedBody() {
		return typeof this.body === 'object' ? JSON.stringify(this.body) : this.body;
	}

	terminate() {
		Object.freeze(this);
		this._terminate.handleResponse(this);
	}
}

module.exports = Response;

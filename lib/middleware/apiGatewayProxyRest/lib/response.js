const smash = require("../../../../smash");
const errorUtil = smash.errorUtil();
const { HEADERS, DEFAULT_ACCEPT, DEFAULT_CONTENT_TYPE } = require("./constant");
const Headers = require("./headers");
const ResponseContentType = require("./responseContentType/responseContentType");
const responseContentType = new ResponseContentType();
const accepts = require('accepts');

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
		this._setupHeaders(request);
		this.body = null;
		this.isBase64Encoded = false;
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

	_cleanAndAssign(body, context) {
		return new Promise((resolve, reject) => {
			if (smash.filter.hasOutRule(this.request.route) === true) {
				smash.filter.cleanOut(this.request.route, body, context).then(resolve).catch(reject);
			} else {
				reject(this.internalServerError("No outRule found for " + JSON.stringify(this.request.route) + ", did you call cleanOk or cleanCreated without defining a outRule?"));
			}
		});
	}

	_setupHeaders(request) {
		this.headers = new Headers();
		try {
			console.log("REQUEST", request);
			const accept = accepts(request);
			console.log("ACCEPT", accept);
			console.log("CONTENT_TYPE", responseContentType.getAvailableContentTypes());
			const contentType = accept.type(responseContentType.getAvailableContentTypes());
			if (contentType === false) {
				throw errorUtil.notAcceptableError(request.headers.get(HEADERS.ACCEPT));
			} else if (contentType === DEFAULT_ACCEPT) {
				this.headers.set(HEADERS.CONTENT_TYPE, DEFAULT_CONTENT_TYPE);
			} else {
				this.headers.set(HEADERS.CONTENT_TYPE, contentType);
			}
		} catch (error) {
			console.log("ACCEPT_ERROR", error);
			this.headers.set(HEADERS.CONTENT_TYPE, DEFAULT_CONTENT_TYPE);
		}
		return this;
	}

	cleanOk(body, context = {}) {
		this._cleanAndAssign(body, { ...context, request: this.request, response: this }).then(cleanedBody => {
			this.ok(cleanedBody);
		}).catch(error => {
			this.handleError(error);
		});
	}

	ok(body) {
		return this.handleResponse(200, body);
	}

	created(body) {
		return this.handleResponse(201, body);
	}

	cleanCreated(body, context = {}) {
		this._cleanAndAssign(body, { ...context, request: this.request, response: this }).then(cleanedBody => {
			this.created(cleanedBody);
		}).catch(error => {
			this.handleError(error);
		});
	}

	accepted() {
		return this.handleResponse(202);
	}

	noContent() {
		return this.handleResponse(204);
	}

	_getRedirectHeaders(url) {
		return { Location: url };
	}

	movedPermanently(url) {
		return this.handleResponse(301, "", this._getRedirectHeaders(url));
	}

	found(url) {
		return this.handleResponse(302, "", this._getRedirectHeaders(url));
	}

	temporaryRedirect(url) {
		return this.handleResponse(307, "", this._getRedirectHeaders(url));
	}

	permanentRedirect(url) {
		return this.handleResponse(308, "", this._getRedirectHeaders(url));
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
		return this.handleResponse(response.statusCode, response.body);
	}

	handleResponse(code, body = "", headers = null) {
		this.code = code;
		this.body = body;
		this.addHeaders(headers);
		this.terminate();
		return this;
	}

	handleBinaryResponse(code, body = "", headers = null) {
		this.code = code;
		this.body = body;
		this.addHeaders(headers);
		this.isBase64Encoded = true;
		this.terminate();
		return this;
	}

	handleError(error) {
		if (errorUtil.isSmashError(error) === false) {
			error = errorUtil.internalServerError("First argument of handleError(error) must be a SmashError, " + errorUtil.typeOf(error), error);
		}
		error.requestId = this.request.requestId;
		error.printError();
		return this.handleResponse(error.code, error.body);
	}

	addHeader(key, value) {
		this.headers.set(key, value);
		return this;
	}

	addHeaders(headers = {}) {
		for (const key in headers) {
			this.addHeader(key, headers[key]);
		}
		return this;
	}

	get stringifiedBody() {
		return responseContentType.execute({ response: this, body: this.body });
	}

	terminate() {
		Object.freeze(this);
		this._terminate.handleResponse(this);
	}
}

module.exports = Response;

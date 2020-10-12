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

	get codes() {
		return {
			200: "ok",
			201: "created",
			202: "accepted",
			204: "noContent",
			301: "movedPermanently",
			302: "found",
			307: "temporaryRedirect",
			308: "permanentRedirect",
			400: "badRequest",
			401: "unauthorized",
			403: "forbidden",
			404: "notFound",
			409: "conflict",
		};
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

	_cleanAndAssign({ code, body, context }) {
		return new Promise((resolve, reject) => {
			if (this.request.hasOutRule()) {
				this.request.cleanOut(code, body, context).then(resolve).catch(reject);
			} else if (smash.filter.hasOutRule(this.request.route) === true) {
				//TODO deprecate
				//TODO logger deprecate
				smash.filter.cleanOut(this.request.route, body, context).then(resolve).catch(reject);
			} else {
				reject(this.internalServerError("No outRule found for " + JSON.stringify(this.request.route) + ", did you call cleanOk or cleanCreated without defining a outRule?"));
			}
		});
	}

	_setupHeaders(request) {
		this.headers = new Headers();
		try {
			const accept = accepts(request);
			const contentType = accept.type(responseContentType.getAvailableContentTypes());
			if (contentType === false) {
				throw errorUtil.notAcceptableError(request.headers.get(HEADERS.ACCEPT));
			} else if (contentType === DEFAULT_ACCEPT) {
				this.headers.set(HEADERS.CONTENT_TYPE, DEFAULT_CONTENT_TYPE);
			} else {
				this.headers.set(HEADERS.CONTENT_TYPE, contentType);
			}
		} catch (error) {
			this.headers.set(HEADERS.CONTENT_TYPE, DEFAULT_CONTENT_TYPE);
		}
		return this;
	}

	_getRedirectHeaders(url) {
		return { Location: url };
	}

	cleanOk(body, context = {}) {
		this.checkResponseCompliance(this.codes[200]);
		this._cleanAndAssign({ code: this.codes[200], body, context: { ...context, request: this.request, response: this } })
			.then(body => this.ok(body))
			.catch(error => this.handleError(error));
	}

	ok(body) {
		this.checkResponseCompliance(this.codes[200]);
		return this.handleResponse(200, body);
	}

	created(body) {
		this.checkResponseCompliance(this.codes[201]);
		return this.handleResponse(201, body);
	}

	cleanCreated(body, context = {}) {
		this.checkResponseCompliance(this.codes[201]);
		this._cleanAndAssign({ code: this.codes[201], body, context: { ...context, request: this.request, response: this } })
			.then(body => this.created(body))
			.catch(error => this.handleError(error));
	}

	accepted() {
		this.checkResponseCompliance(this.codes[202]);
		return this.handleResponse(202);
	}

	noContent() {
		this.checkResponseCompliance(this.codes[204]);
		return this.handleResponse(204);
	}

	movedPermanently(url) {
		this.checkResponseCompliance(this.codes[301]);
		return this.handleResponse(301, "", this._getRedirectHeaders(url));
	}

	found(url) {
		this.checkResponseCompliance(this.codes[302]);
		return this.handleResponse(302, "", this._getRedirectHeaders(url));
	}

	temporaryRedirect(url) {
		this.checkResponseCompliance(this.codes[307]);
		return this.handleResponse(307, "", this._getRedirectHeaders(url));
	}

	permanentRedirect(url) {
		this.checkResponseCompliance(this.codes[308]);
		return this.handleResponse(308, "", this._getRedirectHeaders(url));
	}

	badRequest(message, details) {
		this.checkResponseCompliance(this.codes[400]);
		return this.handleError(errorUtil.badRequestError(message, details));
	}

	unauthorized(message) {
		this.checkResponseCompliance(this.codes[401]);
		return this.handleError(errorUtil.unauthorizedError(message));
	}

	forbidden(message) {
		this.checkResponseCompliance(this.codes[403]);
		return this.handleError(errorUtil.forbiddenError(message));
	}

	notFound(message) {
		this.checkResponseCompliance(this.codes[404]);
		return this.handleError(errorUtil.notFoundError(message));
	}

	conflict(message) {
		this.checkResponseCompliance(this.codes[409]);
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
		if (this.codes[response.statusCode]) {
			this.checkResponseCompliance(this.codes[response.statusCode]);
		}
		return this.handleResponse(response.statusCode, response.body);
	}

	checkResponseCompliance(code) {
		if (this.request && this.request.isResponseCompliant) {
			if (this.request.isResponseCompliant(code) === false) {
				throw errorUtil.internalServerError("Response " + code + " is not declared in route definition");
			}
		}
		return this;
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
		try {
			if (errorUtil.isSmashError(error) === false) {
				error = errorUtil.internalServerError("First argument of handleError(error) must be a SmashError, " + errorUtil.typeOf(error), error);
			}
			error.requestId = this.request.requestId;
			error.printError();
			this.checkResponseCompliance(this.codes[error.code]);
			if (this.request && this.request.hasOutRule && this.request.hasOutRule(this.codes[error.code])) {
				this._cleanAndAssign({ code: this.codes[error.code], body: error.body, context: { request: this.request, response: this } }).then(body => {
					this.handleResponse(error.code, body);
				}).catch(error => this.handleEmergencyError(error));
			} else {
				this.handleResponse(error.code, error.body);
			}
		} catch (error) {
			this.handleEmergencyError(error);
		}
	}

	handleEmergencyError(parentError) {
		const error = errorUtil.internalServerError("Emergency error", parentError);
		error.requestId = this.request.requestId;
		error.printError();
		this.handleResponse(error.code, error.body);
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

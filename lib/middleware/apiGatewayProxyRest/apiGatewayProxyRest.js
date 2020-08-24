const smash = require("../../../smash");
const logger = smash.logger();
const errorUtil = smash.errorUtil();
const Request = require("./lib/request");
const Response = require("./lib/response");
const Router = require("./lib/router");
const { RESPONSE_HEADERS_DEFAULT } = require("./lib/constant");

class ApiGatewayProxyRest {
	constructor() {
		this.router = new Router();
	}

	_buildRequest(event, context) {
		const request = new Request(event, context);
		return request;
	}

	_buildResponse(request) {
		const response = new Response(this, request);
		const headers = smash.config.get(RESPONSE_HEADERS_DEFAULT);
		response.addHeaders(headers);
		return response;
	}

	_buildErrorResponse({ requestContext }) {
		const request = {};
		if (requestContext.requestId) {
			request.requestId = requestContext.requestId;
		}
		return this._buildResponse(request);
	}

	handleEvent(event, context, callback) {
		if (typeof callback !== 'function') {
			throw new errorUtil.TypeError("Third parameter of handleEvent() must be a function, ", callback);
		}
		try {
			this._callback = callback;
			const request = this._buildRequest(event, context);
			const response = this._buildResponse(request);
			if (typeof event !== "object" || this.isEvent(event) === false) {
				response.handleError(errorUtil.internalServerError("Wrong type of event as argument to ApiGatewayProxy.handleEvent()"));
			} else {
				try {
					this.router.handleRequest(request, response);
				} catch (error) {
					return response.handleError(error);
				}
				this.handleRequest(request, response);
			}
		} catch (error) {
			const response = this._buildErrorResponse(event);
			response.handleError(error);
		}
	}

	getPrintableUser(request) {
		if (request.user) {
			const { id, account, username, region } = request.user;
			return JSON.stringify({ id, username, account, region });
		}
		return "Anonymous";
	}

	async handleRequest(request, response) {
		logger.info("Matched route: " + request.route.method + " " + request.route.path + " => " + request.path + "; version: " + request.route.version + "; user: " + this.getPrintableUser(request));
		smash.setCurrentEvent(request);
		try {
			if (smash.filter.hasInRule(request.route) === true) {
				await smash.filter.cleanIn(request.route, request);
			}
			await request.route.callback.call(smash, request, response);
		} catch (error) {
			response.handleError(error);
		}
		return this;
	}

	handleResponse(response) {
		logger.info("Response code: " + response.code);
		this._callback(null, {
			statusCode: response.code,
			headers: response.headers.toRawObject(),
			body: response.stringifiedBody,
			isBase64Encoded: response.isBase64Encoded,
		});
		return this;
	}

	isEvent(event) {
		return Boolean(event.httpMethod && event.path && !event.type);
	}

	get(route, callback) {
		this.router.get(route, callback);
		return this;
	}

	post(route, callback) {
		this.router.post(route, callback);
		return this;
	}

	put(route, callback) {
		this.router.put(route, callback);
		return this;
	}

	delete(route, callback) {
		this.router.delete(route, callback);
		return this;
	}

	patch(route, callback) {
		this.router.patch(route, callback);
		return this;
	}

	options(route, callback) {
		this.router.options(route, callback);
		return this;
	}

	head(route, callback) {
		this.router.head(route, callback);
		return this;
	}

	sameAs(route, { action, version }) {
		this.router.sameAs(route, { action, version });
		return this;
	}

	getHandlers() {
		return this.getRoutes();
	}

	getRoutes() {
		return this.router.getRoutes();
	}

	expose() {
		return [
			{
				"functionName": "get",
				"function": "get",
			},
			{
				"functionName": "post",
				"function": "post",
			},
			{
				"functionName": "put",
				"function": "put",
			},
			{
				"functionName": "delete",
				"function": "delete",
			},
			{
				"functionName": "patch",
				"function": "patch",
			},
			{
				"functionName": "options",
				"function": "options",
			},
			{
				"functionName": "head",
				"function": "head",
			},
			{
				"functionName": "sameAs",
				"function": "sameAs",
			},
		];
	}
}

module.exports = ApiGatewayProxyRest;

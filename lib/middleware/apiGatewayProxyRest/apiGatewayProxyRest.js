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

	handleEvent(event, context, callback) {
		if (typeof callback !== 'function') {
			throw new errorUtil.TypeError("Third parameter of handleEvent() must be a function, ", callback);
		}
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
	}

	async handleRequest(request, response) {
		logger.info("RequestId: " + request.requestId);
		logger.info("Matched route: " + request.route.method + " " + request.route.path + "; version: " + request.route.version + "; request: " + request.route.method + " " + request.path + " in env: " + smash.getEnv("ENV") + " with user: " + (request.user ? request.user.username : "Anonymous"));
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
			headers: response.headers,
			body: response.stringifiedBody,
		});
		return this;
	}

	isEvent(event) {
		if (event.httpMethod && event.path && !event.type) {
			return true;
		}
		return false;
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
		];
	}
}

module.exports = ApiGatewayProxyRest;

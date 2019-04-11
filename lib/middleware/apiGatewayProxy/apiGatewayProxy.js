const smash = require("../../../smash.js");
const logger = smash.logger("ApiGatewayProxy");
const errorUtil = new smash.SmashError(logger);
const Next = require("./lib/next.js");
const Request = require("./lib/request.js");
const Response = require("./lib/response.js");
const Router = require("./lib/router.js");
const Route = require("./lib/route.js");
const RESPONSE_HEADERS_DEFAULT = "apiGatewayProxy.response.headers.default";

class ApiGatewayProxy extends Next {
    constructor() {
        super();
        this._router = new Router();
        this._link();
    }

    get smash() {
        return smash;
    }

    get router() {
        return this._router;
    }

    _link() {
        this.setNext(this.router);
        this.router.setNext(this);
        return this;
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
            throw new Error("Third parameter of handleEvent() must be a function, " + errorUtil.typeOf(callback));
        }
        this._callback = callback;
        const request = this._buildRequest(event, context);
        const response = this._buildResponse(request);
        if (typeof event !== "object" || this.isEvent(event) === false) {
            response.handleError(errorUtil.internalServerError("Wrong type of event as argument to ApiGatewayProxy.handleEvent()"));
        } else {
            this.next(request, response);
        }
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            response.handleError(errorUtil.internalServerError("First parameter of handleRequest() must be Request object type, " + errorUtil.typeOf(request)));
            return this;
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            response.handleError(errorUtil.internalServerError("Second parameter of handleRequest() must be Response object type, " + errorUtil.typeOf(response)));
            return this;
        }
        if (request.constructor !== Request || request.route.constructor !== Route) {
            response.handleError(errorUtil.internalServerError("Missing matched route in request"));
            return this;
        }
        logger.info("RequestId: " + request.requestId);
        logger.info("Matched route: " + request.route.method + " " + request.route.path + "; version: " + request.route.version + "; request: " + request.path + " in env: " + smash.getEnv("ENV") + " with user: " + (request.user ? request.user.username : "Anonymous"));
        smash.setCurrentEvent(request);
        if (smash.binder.requiredRuleExist(request.route.action) === true) {
            const bodyIsValid = smash.binder.hasRequired(request.route.action, request.body);
            if (bodyIsValid !== true) {
                response.handleError(errorUtil.badRequestError("Invalid body", bodyIsValid));
                return this;
            }
        }
        request.route.callback.call(smash, request, response);
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
        try {
            this.router.get(route, callback);
        } catch (error) {
            logger.error("Failed to register GET route", route, error);
            response.handleError(errorUtil.internalServerError());
        }
        return this;
    }

    post(route, callback) {
        try {
            this.router.post(route, callback);
        } catch (error) {
            logger.error("Failed to register POST route", route, error);
            response.handleError(errorUtil.internalServerError());
        }
        return this;
    }

    put(route, callback) {
        try {
            this.router.put(route, callback);
        } catch (error) {
            logger.error("Failed to register PUT route", route, error);
            response.handleError(errorUtil.internalServerError());
        }
        return this;
    }

    delete(route, callback) {
        try {
            this.router.delete(route, callback);
        } catch (error) {
            logger.error("Failed to register DELETE route", route, error);
            response.handleError(errorUtil.internalServerError());
        }
        return this;
    }

    patch(route, callback) {
        try {
            this.router.patch(route, callback);
        } catch (error) {
            logger.error("Failed to register PATCH route", route, error);
            response.handleError(errorUtil.internalServerError());
        }
        return this;
    }

    options(route, callback) {
        try {
            this.router.options(route, callback);
        } catch (error) {
            logger.error("Failed to register OPTIONS route", route, error);
            response.handleError(errorUtil.internalServerError());
        }
        return this;
    }

    head(route, callback) {
        try {
            this.router.head(route, callback);
        } catch (error) {
            logger.error("Failed to register HEAD route", route, error);
            response.handleError(errorUtil.internalServerError());
        }
        return this;
    }

    expose() {
        return [
            {
                "functionName": "get",
                "function": "get"
            },
            {
                "functionName": "post",
                "function": "post"
            },
            {
                "functionName": "put",
                "function": "put"
            },
            {
                "functionName": "delete",
                "function": "delete"
            },
            {
                "functionName": "patch",
                "function": "patch"
            },
            {
                "functionName": "options",
                "function": "options"
            },
            {
                "functionName": "head",
                "function": "head"
            }
        ];
    }
}

module.exports = ApiGatewayProxy;

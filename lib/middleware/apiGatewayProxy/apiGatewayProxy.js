const smash = require("../../../smash.js");
const Next = require("./lib/next.js");
const Request = require("./lib/request.js");
const Response = require("./lib/response.js");
const Router = require("./lib/router.js");
const Route = require("./lib/route.js");
const RESPONSE_HEADERS_DEFAULT = "apiGatewayProxy.response.headers.default";

class ApiGatewayProxy extends Next {
    constructor() {
        super();
        this._smash = smash;
        this._router = new Router();
        this._link();
    }

    get smash() {
        return this._smash;
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

    _buildResponse(event) {
        const response = new Response(this);
        const headers = this.smash.config.get(RESPONSE_HEADERS_DEFAULT);
        if (headers !== undefined) {
            for (let key in headers) {
                response.addHeader(key, headers[key]);
            }
        }
        return response;
    }

    handleEvent(event, context, callback) {
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of handleEvent() must be a function, " + this.typeOf(callback));
        }
        this._callback = callback;
        const response = this._buildResponse(event);
        if (typeof event !== "object" || this.isEvent(event) === false) {
            this.error("Wrong type of event as argument to ApiGatewayProxy.handleEvent()");
            response.internalServerError("Internal server error");
        } else {
            const request = this._buildRequest(event, context);
            this.next(request, response);
        }
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            this.error("First parameter of handleRequest() must be Request object type, " + this.typeOf(request));
            response.internalServerError("Internal server error");
            return this;
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            this.error("Second parameter of handleRequest() must be Response object type, " + this.typeOf(response));
            response.internalServerError("Internal server error");
            return this;
        }
        if (request.constructor !== Request || request.route.constructor !== Route) {
            this.error("Missing matched route in request");
            response.internalServerError("Internal server error");
            return this;
        }
        this.info("API Gateway requestId: " + request.requestId);
        this.info("Matched route: " + request.route.method + " " + request.route.path + "; version: " + request.route.version + "; request: " + request.path + " in env: " + this.smash.getEnv("ENV") + " with user: " + (request.user ? request.user.username : "Anonymous"));
        request.route.callback.call(smash, request, response);
        return this;
    }

    handleResponse(response) {
        this.info("Response code: " + response.code);
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
            this.error("Failed to register GET route", route);
            response.internalServerError("Internal server error");
        }
        return this;
    }

    post(route, callback) {
        try {
            this.router.post(route, callback);
        } catch (error) {
            this.error("Failed to register POST route", route);
            response.internalServerError("Internal server error");
        }
        return this;
    }

    put(route, callback) {
        try {
            this.router.put(route, callback);
        } catch (error) {
            this.error("Failed to register PUT route", route);
            response.internalServerError("Internal server error");
        }
        return this;
    }

    delete(route, callback) {
        try {
            this.router.delete(route, callback);
        } catch (error) {
            this.error("Failed to register DELETE route", route);
            response.internalServerError("Internal server error");
        }
        return this;
    }

    patch(route, callback) {
        try {
            this.router.patch(route, callback);
        } catch (error) {
            this.error("Failed to register PATCH route", route);
            response.internalServerError("Internal server error");
        }
        return this;
    }

    options(route, callback) {
        try {
            this.router.options(route, callback);
        } catch (error) {
            this.error("Failed to register OPTIONS route", route);
            response.internalServerError("Internal server error");
        }
        return this;
    }

    head(route, callback) {
        try {
            this.router.head(route, callback);
        } catch (error) {
            this.error("Failed to register HEAD route", route);
            response.internalServerError("Internal server error");
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
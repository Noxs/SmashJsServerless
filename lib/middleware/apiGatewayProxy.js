const Next = require("../core/next.js");
const Request = require("../core/request.js");
const Response = require("../core/response.js");
const Router = require("../core/router.js");
const Route = require("../core/route.js");
const UserProvider = require("../core/userProvider.js");
const Authorization = require("../core/authorization.js");
const smash = require("../../smash.js");

class ApiGatewayProxy extends Next {
    constructor() {
        super();
        this._smash = smash;
        this._router = new Router();
        this._userProvider = new UserProvider();
        this._authorization = new Authorization();
        this._link();
    }

    get smash() {
        return this._smash;
    }

    get router() {
        return this._router;
    }

    get userProvider() {
        return this._userProvider;
    }

    get authorization() {
        return this._authorization;
    }

    _link() {
        this.setNext(this.router);
        this.router.setNext(this.userProvider);
        this.userProvider.setNext(this.authorization);
        this.authorization.setNext(this);
        return this;
    }

    attachUserRepository(repository) {
        this.userProvider.attachRepository(repository);
        return this;
    }

    _buildRequest(event) {
        const request = new Request(event);
        return request;
    }

    _buildResponse(event) {
        const response = new Response(this);
        const headers = this.smash.config.get("response.headers.default");
        if (headers !== undefined) {
            for (let key in headers) {
                response.addHeader(key, headers[key]);
            }
        }
        return response;
    }

    handleEvent(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error("Second parameter of handleEvent() must be a function, " + this.typeOf(callback) + " given");
        }
        this._callback = callback;
        const response = this._buildResponse(event);
        if (typeof event !== "object" || this.isEvent(event) === false) {
            this.error("Wrong type of event as argument to ApiGatewayProxy.handleEvent()");
            response.internalServerError("Internal server error");
        } else {
            const request = this._buildRequest(event);
            this.next(request, response);
        }
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            this.error("First parameter of handleRequest() must be Request object type, " + this.typeOf(request) + " given");
            response.internalServerError("Internal server error");
            return;
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            this.error("Second parameter of handleRequest() must be Response object type, " + this.typeOf(response) + " given");
            response.internalServerError("Internal server error");
            return;
        }
        if (request.constructor !== Request || request.route.constructor !== Route) {
            this.error("Missing matched route in request");
            response.internalServerError("Internal server error");
            return;
        }
        this.info("Match route: " + request.route.method + " path: " + request.route.path + " version: " + request.route.version + " authorizations: " + request.route.authorizations.join("||") + " for request: " + request.path + " in env: " + this.smash.getEnv("ENV"));
        request.route.callback(request, response);
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
        if (!event.httpMethod || !event.path) {
            return false;
        }
        return true;
    }

    get(route, callback) {
        //TODO error management
        const routeObject = this.router.get(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    post(route, callback) {
        //TODO error management
        const routeObject = this.router.post(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    put(route, callback) {
        //TODO error management
        const routeObject = this.router.put(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    delete(route, callback) {
        //TODO error management
        const routeObject = this.router.delete(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    patch(route, callback) {
        //TODO error management
        const routeObject = this.router.patch(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    options(route, callback) {
        //TODO error management
        const routeObject = this.router.options(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    head(route, callback) {
        //TODO error management
        const routeObject = this.router.head(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }
}

module.exports = ApiGatewayProxy;
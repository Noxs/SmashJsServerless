const smash = require("../../../../smash.js");
const logger = smash.logger("Router");
const errorUtil = new smash.SmashError(logger);
const { METHODS } = require("./constant.js");
const Next = require("./next.js");
const Route = require("./route.js");
const Request = require("./request.js");
const Response = require("./response.js");

class Router extends Next {
    constructor() {
        super();
        this._routes = [];
    }

    _registerRoute(method, route, callback) {
        const routeObject = new Route(method, route, callback);
        this._routes.push(routeObject);
        return routeObject;
    }

    get(route, callback) {
        return this._registerRoute(METHODS.GET, route, callback);
    }

    post(route, callback) {
        return this._registerRoute(METHODS.POST, route, callback);
    }

    put(route, callback) {
        return this._registerRoute(METHODS.PUT, route, callback);
    }

    delete(route, callback) {
        return this._registerRoute(METHODS.DELETE, route, callback);
    }

    patch(route, callback) {
        return this._registerRoute(METHODS.PATCH, route, callback);
    }

    options(route, callback) {
        return this._registerRoute(METHODS.OPTIONS, route, callback);
    }

    head(route, callback) {
        return this._registerRoute(METHODS.HEAD, route, callback);
    }

    _matchRoutes(request) {
        for (let i = 0, length = this._routes.length; i < length; i++) {
            if (this._routes[i].match(request) === true) {
                return this._routes[i];
            }
        }
        return null;
    }

    getRoutes() {
        return this._routes;
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            response.handleError(errorUtil.internalServerError("First parameter of handleRequest() must be Request object type, " + errorUtil.typeOf(request) + " given"));
            return;
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            response.handleError(errorUtil.internalServerError("Second parameter of handleRequest() must be Response object type, " + errorUtil.typeOf(response) + " given"));
            return;
        }
        const route = this._matchRoutes(request);
        if (route === null) {
            response.handleError(errorUtil.notFoundError({ name: "Route", primary: request.method + " " + request.path }, "Route not found for" + request.method + " " + request.path));
        } else {
            request.route = route;
            this.next(request, response);
        }
    }
}

module.exports = Router;

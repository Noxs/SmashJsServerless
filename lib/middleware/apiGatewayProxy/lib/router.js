const METHODS = require("./methods.js");
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
        const routes = [];
        for (let i = 0, length = this._routes.length; i < length; i++) {
            if (this._routes[i].match(request) === true) {
                routes.push(this._routes[i]);
                console.log("MATCH", this._routes[i].path);
            } else {
                console.log("NO MATCH", this._routes[i].path);
            }
        }
        return routes;
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
        request.routes = this._matchRoutes(request);
        console.log(request.routes);
        if (request.routes.length === 0) {
            this.info("No route found for ", request.method, request.path);
            response.notFound("Not found");
        } else {
            this.next(request, response);
        }
    }
}

module.exports = Router;
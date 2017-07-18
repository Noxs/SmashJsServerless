var smash = require("../smash.js");
function router() {
    var that = this;
    const defaultInterpolation = ":";
    const slash = "/";
    const regexp = "[^\/]+";
    var next = null;
    var fail = null;
    var interpolation = defaultInterpolation;
    //TODO optimize this with one array for each method
    var routes = [];
    var methods = {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        PATCH: "PATCH",
        DELETE: "DELETE",
        OPTIONS: "OPTIONS",
        HEAD: "HEAD"
    };
    var registerRoute = function (method, route, callback) {
        route.method = method;
        if (!route.env) {//TODO why this?
            route.env = smash.getEnv();
        }
        if (!route.path && !route.byPass) {
            throw new Error("Missing argument path to register route.");
        }
        if (!callback) {
            throw new Error("Missing argument callback to register route.");
        } else {
            route.callback = callback;
        }
        buildRouteParameter(route);
        routes.push(route);
    };
    var buildRouteParameter = function (route) {
        if (route.path && route.path.indexOf(interpolation) !== -1) {
            route.interpolation = {number: 0, keywords: [], regexp: null, positions: []};
            var ressources = route.path.split(slash);
            for (var i = 0, length = ressources.length; i < length; i++) {
                if (ressources[i].startsWith(interpolation) === true) {
                    route.interpolation.number++;
                    route.interpolation.keywords.push(regexp);
                    route.interpolation.positions.push({keyword: ressources[i], index: i});
                } else {
                    route.interpolation.keywords.push(ressources[i]);
                }
            }
            route.interpolation.regexp = route.interpolation.keywords.join(slash);
        } else {
            route.interpolation = false;
        }
        return that;
    };
    var matchRoute = function (request, route) {
        //TODO
        //is it std to set a 404 if the method is not good
        //maybe match method at the end and use another code
        if (route.method !== request.method) {
            return null;
        }
        if (route.byPass === true) {
            return route;
        }
        if (route.version && route.version !== request.version) {
            return null;
        }
        if (route.env && route.env !== request.env) {
            return null;
        }
        var path = route.path;
        if (route.interpolation) {
            path = route.interpolation.regexp;
            var parameters = request.path.split(slash);
            for (var i = 0, lengthI = parameters.length; i < lengthI; i++) {
                for (var j = 0, lengthJ = route.interpolation.positions.length; j < lengthJ; j++) {
                    if (route.interpolation.positions[j].index === i) {
                        request.parameters[route.interpolation.positions[j].keyword.substr(1)] = parameters[i];
                    }
                }
            }
        }
        if (request.path.match(new RegExp("^" + path + "$")) === null) {
            return null;
        }
        return route;
    };
    var matchRoutes = function (request, response) {
        for (var i = 0, length = routes.length; i < length; i++) {
            var route = matchRoute(request, routes[i]);
            if (route !== null) {
                request.route = route;
                next(request, response);
                return true;
            }
        }
        if (smash.getLogger()) {
            smash.getLogger().log("Route not found for: " + request.path);
        }
        response.notFound("not found");
        fail(response);
        return false;
    };
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.get = function (route, callback) {
        registerRoute(methods.GET, route, callback);
        return that;
    };
    that.post = function (route, callback) {
        registerRoute(methods.POST, route, callback);
        return that;
    };
    that.put = function (route, callback) {
        registerRoute(methods.PUT, route, callback);
        return that;
    };
    that.delete = function (route, callback) {
        registerRoute(methods.DELETE, route, callback);
        return that;
    };
    that.patch = function (route, callback) {
        registerRoute(methods.PATCH, route, callback);
        return that;
    };
    that.options = function (route, callback) {
        registerRoute(methods.OPTIONS, route, callback);
        return that;
    };
    that.head = function (route, callback) {
        registerRoute(methods.HEAD, route, callback);
        return that;
    };
    that.handleRequest = function (request, response) {
        return matchRoutes(request, response);
    };
    that.getRoutes = function () {
        return routes;
    };
    that.clearRoutes = function () {
        routes = [];
        return that;
    };
    that.getInterpolation = function () {
        return interpolation;
    };
    that.setInterpolation = function (extInterpolation) {
        interpolation = extInterpolation;
        for (var i = 0, length = routes.length; i < length; i++) {
            buildRouteParameter(routes[i]);
        }
        return that;
    };
}

module.exports = {
    build: function () {
        if (smash.getRouter() === null) {
            smash.registerRouter(new router());
        }
        return smash.getRouter();
    },
    get: function () {
        return smash.getRouter();
    }
};
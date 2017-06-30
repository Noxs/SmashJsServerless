var smash = require("../smash.js");
var execute = function () {
    var that = this;
    const defaultInterpolation = ":";
    const slash = "/";
    const regexp = "[^\/.]+";
    that.next = null;
    that.interpolation = defaultInterpolation;
    //TODO optimize this with one array for each method
    that.routes = [];
    that.methods = {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        PATCH: "PATCH",
        DELETE: "DELETE",
        OPTIONS: "OPTIONS",
        HEAD: "HEAD"
    };
    that.registerRoute = function (method, route, callback) {
        route.method = method;
        if (!route.env) {
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
        that.buildRouteParameter(route);
        that.routes.push(route);
    };
    that.buildRouteParameter = function (route) {
        if (route.path && route.path.indexOf(that.interpolation) !== -1) {
            route.interpolation = {number: 0, keywords: [], regexp: null, positions: []};
            var ressources = route.path.split(slash);
            for (var i = 0, length = ressources.length; i < length; i++) {
                if (ressources[i].startsWith(that.interpolation) === true) {
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
    that.matchRoute = function (request, route) {
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
    that.matchRoutes = function (request, response) {
        for (var i = 0, length = that.routes.length; i < length; i++) {
            var route = that.matchRoute(request, that.routes[i]);
            if (route !== null) {
                request.route = route;
                that.next(request, response);
                return true;
            }
        }
        response.notFound("not found");
        return false;
    };
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        get: function (route, callback) {
            that.registerRoute(that.methods.GET, route, callback);
            return that;
        },
        post: function (route, callback) {
            that.registerRoute(that.methods.POST, route, callback);
            return that;
        },
        put: function (route, callback) {
            that.registerRoute(that.methods.PUT, route, callback);
            return that;
        },
        delete: function (route, callback) {
            that.registerRoute(that.methods.DELETE, route, callback);
            return that;
        },
        patch: function (route, callback) {
            that.registerRoute(that.methods.PATCH, route, callback);
            return that;
        },
        options: function (route, callback) {
            that.registerRoute(that.methods.OPTIONS, route, callback);
            return that;
        },
        head: function (route, callback) {
            that.registerRoute(that.methods.HEAD, route, callback);
            return that;
        },
        handleRequest: function (request, response) {
            return that.matchRoutes(request, response);
        },
        getRoutes: function () {
            return that.routes;
        },
        clearRoutes: function () {
            that.routes = [];
            return that;
        },
        getInterpolation: function () {
            return that.interpolation;
        },
        setInterpolation: function (interpolation) {
            that.interpolation = interpolation;
            for (var i = 0, length = that.routes.length; i < length; i++) {
                that.buildRouteParameter(that.routes[i]);
            }
            return that;
        }
    };
};
var router = execute();
module.exports = router;
smash.registerRouter(router);
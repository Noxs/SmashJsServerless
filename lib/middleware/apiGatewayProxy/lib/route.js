const smash = require("../../../../smash.js");
const logger = smash.logger("Route");
const errorUtil = new smash.SmashError(logger);
const RouteParameter = require("./routeParameter.js");
const { METHODS, INTERPOLATION, DEFAULT, SLASH, PATH_REGEXP } = require("./constant.js");

class Route {
    constructor(method, route, callback) {
        if (typeof method !== 'string') {
            throw new Error("First parameter of Route() must be a string, " + errorUtil.typeOf(method));
        }
        if (METHODS[method] !== method) {
            throw new Error("First parameter of Route() can be GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD; " + errorUtil.typeOf(method));
        }
        this._method = method;
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of Route() must be a function, " + errorUtil.typeOf(callback));
        }
        if (callback.length !== 2) {
            throw new Error("Third parameter of Route() must be a function witch takes 2 parameters: Request and Response, " + callback.length);
        }
        this._callback = callback;
        if (typeof route !== 'object') {
            throw new Error("Second parameter of Route() must be an object, " + errorUtil.typeOf(route));
        }
        if (typeof route.path !== 'string') {
            throw new Error("Second parameter of Route() must have a string property called path, " + errorUtil.typeOf(route.path));
        }
        this._path = route.path;
        if (typeof route.action !== 'string') {
            throw new Error("Second parameter of Route() must have a string property called action, " + errorUtil.typeOf(route.action));
        }
        this._action = route.action;
        if (route.version === undefined || route.version === null) {
            this._version = DEFAULT;
        } else if (typeof route.version !== 'string') {
            throw new Error("Second parameter of Route() can have (optionnal) a string property called version, " + errorUtil.typeOf(route.version));
        } else {
            this._version = route.version;
        }
        this._buildRouteParameters(route);
    }

    _buildRouteParameters(route) {
        this._routeParameters = [];
        this._regexp = route.path;
        if (route.path.indexOf(INTERPOLATION) !== -1) {
            const keywords = [];
            const ressources = route.path.split(SLASH);
            for (let index = 0, length = ressources.length; index < length; index++) {
                if (ressources[index].startsWith(INTERPOLATION) === true) {
                    if (ressources[index].length < 2) {
                        throw new Error("Invalid route parameter " + ressources[index] + " for route " + route.path + ", it should be minimum 1 char plus ':'");
                    }
                    const parameter = new RouteParameter(ressources[index], index);
                    this._routeParameters.push(parameter);
                    keywords.push(PATH_REGEXP);
                } else {
                    keywords.push(ressources[index]);
                }
            }
            this._regexp = keywords.join(SLASH);
        }
    }

    _matchPath(path) {
        if (path.match(new RegExp("^" + this._regexp + "$")) === null) {
            return false;
        } else {
            return true;
        }
    }

    _buildRequestParameters(request) {
        this._parameters = [];
        if (this._routeParameters.length !== 0) {
            const parameters = request.path.split(SLASH);
            for (let i = 0, lengthI = parameters.length; i < lengthI; i++) {
                for (let j = 0, lengthJ = this._routeParameters.length; j < lengthJ; j++) {
                    if (this._routeParameters[j].position === i) {
                        this._parameters[this._routeParameters[j].keyword.substr(1)] = decodeURIComponent(parameters[i]);
                        if (isNaN(this._parameters[this._routeParameters[j].keyword.substr(1)]) === false) {
                            this._parameters[this._routeParameters[j].keyword.substr(1)] = parseInt(this._parameters[this._routeParameters[j].keyword.substr(1)]);
                        }
                    }
                }
            }
        }
    }

    get method() {
        return this._method;
    }

    get version() {
        return this._version;
    }

    get path() {
        return this._path;
    }

    get action() {
        return this._action;
    }

    get parameters() {
        return this._parameters;
    }

    get callback() {
        return this._callback;
    }

    match(request) {
        if (request.method !== this._method) {
            return false;
        }
        if (request.version !== this._version) {
            return false;
        }
        if (this._matchPath(request.path) === false) {
            return false;
        }
        this._buildRequestParameters(request);
        return true;
    }
}

module.exports = Route;

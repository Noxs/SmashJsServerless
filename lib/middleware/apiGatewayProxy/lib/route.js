const smash = require("../../../../smash.js");
const RouteParameter = require("./routeParameter.js");
const METHODS = require("./methods.js");
const INTERPOLATION = ":";
const DEFAULT = require("./version.js");
const SLASH = "/";
const REGEXP = "[^\/]+";

class Route extends smash.Console {
    constructor(method, route, callback) {
        super();
        if (typeof method !== 'string') {
            throw new Error("First parameter of Route() must be a string, " + this.typeOf(method) + " given");
        }
        if (METHODS[method] !== method) {
            throw new Error("First parameter of Route() can be GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD; " + this.typeOf(method) + " given");
        }
        this._method = method;
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of Route() must be a function, " + this.typeOf(callback) + " given");
        }
        if (callback.length !== 2) {
            throw new Error("Third parameter of Route() must be a function witch takes 2 parameters: Request and Response, " + callback.length + " given");
        }
        this._callback = callback;
        if (typeof route !== 'object') {
            throw new Error("Second parameter of Route() must be an object, " + this.typeOf(route) + " given");
        }
        if (typeof route.path !== 'string') {
            throw new Error("Second parameter of Route() must have a string property called path, " + this.typeOf(route.path) + " given");
        }
        this._path = route.path;
        if (route.authorizations === undefined || route.authorizations === null) {
            this._authorizations = null;
        } else if (Array.isArray(route.authorizations)) {
            this._authorizations = route.authorizations;
        } else {
            throw new Error("Second parameter of Route() can have (optionnal) a array property called authorizations, " + this.typeOf(route.authorizations) + " given");
        }
        if (route.version === undefined || route.version === null) {
            this._version = DEFAULT;
        } else if (typeof route.version !== 'string') {
            throw new Error("Second parameter of Route() can have (optionnal) a string property called version, " + this.typeOf(route.version) + " given");
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
                    keywords.push(REGEXP);
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

    get parameters() {
        return this._parameters;
    }

    get authorizations() {
        return this._authorizations;
    }

    get callback() {
        return this._callback;
    }

    addAuthorization(role) {
        if (typeof role !== 'string') {
            throw new Error("First parameter of addAuthorization() must be a string, " + this.typeOf(role) + " given");
        }
        if (this._authorizations === null) {
            this._authorizations = [];
        }
        if (this._authorizations.indexOf(role) === -1) {
            this._authorizations.push(role);
        }
        return this;
    }

    addAuthorizations(roles) {
        if (Array.isArray(roles) === false) {
            throw new Error("First parameter of addAuthorizations() must be a array, " + this.typeOf(roles) + " given");
        }
        for (let i = 0, length = roles.length; i < length; i++) {
            this.addAuthorization(roles[i]);
        }
        return this;
    }

    hasRoles(roles) {
        if (Array.isArray(roles) === true) {
            for (let i = 0, length = roles.length; i < length; i++) {
                if (this._authorizations.indexOf(roles[i]) !== -1) {
                    return true;
                }
            }
        } else {
            this.error("Invalid hasRoles() parameter: must be an array, " + this.typeOf(roles) + " given");
        }
        return false;
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
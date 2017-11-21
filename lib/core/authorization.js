const Next = require('./next.js');
const Route = require('./route.js');
const Request = require("./request.js");
const Response = require("./response.js");
const AUTHORIZATION = "authorization";

class Authorization extends Next {
    constructor() {
        super();
        this._rolesTree = smash.config.get(AUTHORIZATION);
    }

    _isInTree(role) {
        if (typeof role !== 'string') {
            throw new Error("First parameter of _isInTree() must be a string, " + this.typeOf(role) + " given");
        }
        if (typeof this._rolesTree.roles === 'object') {
            for (let key in this._rolesTree.roles) {
                if (key === role) {
                    return true;
                }
            }
        } else if (this._rolesTree !== undefined) {
            throw new Error("Authorization's configuration is not correct");
        }
        return false;
    }

    _findParents(role, findedRoles) {
        if (typeof role !== 'string') {
            throw new Error("First parameter of _findParents() must be a string, " + this.typeOf(role) + " given");
        }
        if (Array.isArray(findedRoles) === false) {
            findedRoles = [];
        }
        for (let key in this._rolesTree.roles) {
            if (this._rolesTree.roles[key].childrens) {
                if (this._rolesTree.roles[key].childrens.indexOf(role) !== -1) {
                    findedRoles.push(key);
                    this._findParents(key, findedRoles);
                }
            }
        }
        return findedRoles;
    }

    buildRouteAuthorizations(route) {
        if (!route || route.constructor !== Route) {
            throw new Error("First parameter of buildRouteAuthorizations() must be Route object type, " + this.typeOf(route) + " given");
        }
        const authorizations = route.authorizations;
        if (authorizations !== null) {
            for (let i = 0, length = authorizations.length; i < length; i++) {
                if (this._isInTree(authorizations[i]) === true) {
                    route.addAuthorizations(this._findParents(authorizations[i]));
                }
            }
        }
        return this;
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
        let route = null;
        for (let i = 0, length = request.routes.length; i < length; i++) {
            if (request.routes[i].authorizations === null) {
                route = request.routes[i];
                break;
            } else if (request.routes[i].hasRoles(request.user.roles) === true) {
                route = request.routes[i];
                break;
            }
        }
        if (route === null) {
            this.info("Not authorized " + (request.user.username ? request.user.username + " " + request.user.roles.join(" ") : "anonymous") + " on path " + request.path + ", roles authorized " + route.authorizations.join(" "));
            response.forbidden("not authorized");
        } else {
            request.route = route;
            this.next(request, response);
        }
    }
}

module.exports = Authorization;
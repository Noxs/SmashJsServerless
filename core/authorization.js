var smash = require("../smash.js");
var execute = function () {
    const confKeyword = "authorization";
    var that = this;
    that.next = null;
    that.roles = {};
    that.conf = null;
    that.goDownInRole = function (roles, role, childrens, list) {
        list.push(role);
        if (childrens) {
            for (var key in childrens) {
                that.goDownInRole(roles, childrens[key], roles[childrens[key]].childrens, list);
            }
        }
        return list;
    };
    that.buildRolesTree = function (conf) {
        for (var key in conf.roles) {
            var authorizedRole = [];
            that.goDownInRole(roles, key, conf.roles[key].childrens, authorizedRole);
            that.roles[key] = {authorized: authorizedRole};
        }

        return that;
    };
    that.isAuthorized = function (routeRole, userRole) {
        if (that.roles[userRole] && that.roles[userRole].authorized.indexOf(routeRole) !== -1) {
            return true;
        } else {
            return false;
        }
    };
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        getConfKeyword: function () {
            return confKeyword;
        },
        applyConfig: function (conf) {
            that.conf = conf;
            that.buildRolesTree(that.conf);
            return that;
        },
        //TODO
        //if the role doesn't exist in the config, it will be ignore
        //maybe this is not a good idea
        handleRequest: function (request, response) {
            if (request.route.authorizations) {
                if (request.user && request.user.roles && request.user.roles.length !== 0) {
                    for (var i = 0, lengthI = request.user.roles.length; i < lengthI; i++) {
                        for (var j = 0, lengthJ = request.route.authorizations.length; j < lengthJ; j++) {
                            if (that.isAuthorized(request.route.authorizations[j], request.user.roles[i]) === true) {
                                that.next(request, response);
                                return true;
                            }
                        }
                    }
                    response.forbidden("not authorized");
                    return false;
                } else {
                    response.forbidden("not authorized");
                    return false;
                }
            }
            that.next(request, response);
            return true;
        }
    };
};
var authorization = execute();
module.exports = authorization;
smash.registerAuthorization(authorization);
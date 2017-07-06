var smash = require("../smash.js");
function authorization() {
    const confKeyword = "authorization";
    var that = this;
    var next = null;
    var fail = null;
    var roles = {};
    var conf = null;
    var goDownInRole = function (roles, role, childrens, list) {
        list.push(role);
        if (childrens) {
            for (var key in childrens) {
                goDownInRole(roles, childrens[key], roles[childrens[key]].childrens, list);
            }
        }
        return list;
    };
    var buildRolesTree = function (conf) {
        for (var key in conf.roles) {
            var authorizedRole = [];
            goDownInRole(roles, key, conf.roles[key].childrens, authorizedRole);
            roles[key] = {authorized: authorizedRole};
        }
        return that;
    };
    var isAuthorized = function (routeRole, userRole) {
        if (roles[userRole] && roles[userRole].authorized.indexOf(routeRole) !== -1) {
            return true;
        } else {
            return false;
        }
    };
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.getConfKeyword = function () {
        return confKeyword;
    };
    that.applyConfig = function (extConf) {
        conf = extConf;
        buildRolesTree(conf);
        return that;
    };
    //TODO
    //if the role doesn't exist in the config, it will be ignore
    //maybe this is not a good idea
    that.handleRequest = function (request, response) {
        if (request.route.authorizations) {
            if (request.user && request.user.roles && request.user.roles.length !== 0) {
                for (var i = 0, lengthI = request.user.roles.length; i < lengthI; i++) {
                    for (var j = 0, lengthJ = request.route.authorizations.length; j < lengthJ; j++) {
                        if (isAuthorized(request.route.authorizations[j], request.user.roles[i]) === true) {
                            next(request, response);
                            return true;
                        }
                    }
                }
                response.forbidden("not authorized");
                fail(response);
                return false;
            } else {
                response.forbidden("not authorized");
                fail(response);
                return false;
            }
        }
        next(request, response);
        return true;
    };
}

smash.registerAuthorization(new authorization());
module.exports = smash.getAuthorization();

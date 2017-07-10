var smash = require("../smash.js");
var requestFactory = require('../core/request.js');
//TODO
//maybe group this with response
//no possibility to define JSON encoder/decoder
function lambdaProxyRequest() {
    var that = this;
    var next = null;
    var fail = null;
    var buildRequest = function (event) {
        if (!event.httpMethod || !event.path) {
            return null;
        }
        var request = requestFactory.createRequest();
        if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.username) {
            request.user = {username: event.requestContext.authorizer.username, roles: null};
        }
        request.method = event.httpMethod;
        request.queryParamters = event.queryStringParameters;
        request.headers = event.headers;
        request.path = event.path;
        if (event.body) {
            request.body = JSON.parse(event.body);
        }
        return request;
    };
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.handleRequest = function (inputRequest, response) {
        try {
            request = buildRequest(inputRequest);
        } catch (error) {
            if (smash.getLogger()) {
                smash.getLogger().error("Invalid json: " + error);
            }
            response.badRequest("Invalid json.");
            fail(response);
            return false;
        }
        if (request !== null) {
            next(request, response);
            return true;
        } else {
            if (smash.getLogger()) {
                smash.getLogger().error("Invalid lambda request");
            }
            response.badRequest("Invalid json.");
            fail(response);
            return false;
        }
    };
}

module.exports = {
    build: function () {
        if (smash.getRequestMiddleware() === null) {
            smash.registerRequestMiddleware(new lambdaProxyRequest());
        }
        return smash.getRequestMiddleware();
    },
    get: function () {
        return smash.getRequestMiddleware();
    }
};

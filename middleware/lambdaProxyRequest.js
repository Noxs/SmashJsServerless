var smash = require("../smash.js");
var requestFactory = require('../core/request.js');
//TODO
//maybe group this with response
//no possibility to define JSON encoder/decoder
function lambdaProxyRequest() {
    var that = this;
    var next = null;
    var buildRequest = function (event) {
        if (!event.httpMethod || !event.path) {
            return null;
        }
        var request = requestFactory.createRequest();
        if (event.requestContext.authorizer.username) {
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
    that.setNext = function (extNext) {
        next = extNext;
        return that;
    };
    that.handleRequest = function (inputRequest, response) {
        request = buildRequest(inputRequest);
        if (request !== null) {
            next(request, response);
            return true;
        } else {
            return false;
        }
    };
}
smash.registerRequestMiddleware(new lambdaProxyRequest());
module.exports = smash.getRequetsMiddleware();

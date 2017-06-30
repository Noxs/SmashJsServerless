var requestFactory = require('../core/request.js');

//TODO
//maybe group this with response
//no possibility to define JSON encoder/decoder
var execute = function () {
    var that = this;
    that.next = null;
    that.buildRequest = function (event) {
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
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        handleRequest: function (inputRequest, response) {
            request = that.buildRequest(inputRequest);
            if (request !== null) {
                that.next(request, response);
                return true;
            } else {
                return false;
            }
        }
    };
};

var lambdaProxyRequest = execute();
module.exports = lambdaProxyRequest;
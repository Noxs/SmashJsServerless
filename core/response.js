//TODO 
//message for some response are not used
function response(terminateCallback) {
    var that = this;
    var code = null;
    var headers = {
        "Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
    };
    var body = null;
    var terminate = terminateCallback;
    that.ok = function (extBody) {
        code = 200;
        body = extBody;
        terminate(that);
        return that;
    };
    that.created = function (extBody) {
        code = 201;
        body = extBody;
        terminate(that);
        return that;
    };
    that.noContent = function () {
        code = 204;
        body = null;
        terminate(that);
        return that;
    };
    that.badRequest = function (message) {
        code = 400;
        body = null;
        terminate(that);
        return that;
    };
    that.unauthorized = function (message) {
        code = 401;
        body = null;
        terminate(that);
        return that;
    };
    that.forbidden = function (message) {
        code = 403;
        body = null;
        terminate(that);
        return that;
    };
    that.notFound = function (message) {
        code = 404;
        body = null;
        terminate(that);
        return that;
    };
    that.conflict = function (message) {
        code = 409;
        body = null;
        terminate(that);
        return that;
    };
    that.internalServerError = function (message) {
        code = 500;
        body = null;
        terminate(that);
        return that;
    };
    that.notImplemented = function (message) {
        code = 501;
        body = null;
        terminate(that);
        return that;
    };
    that.serviceUnavailable = function (message) {
        code = 503;
        body = null;
        terminate(that);
        return that;
    };
    that.setHeaders = function (extHeaders) {
        //check if array type
        headers = extHeaders;
        return that;
    };
    that.getHeaders = function () {
        return headers;
    };
    that.addHeader = function (key, value) {
        headers[key] = value;
        return that;
    };
    that.getBody = function () {
        return body;
    };
    that.setBody = function (extBody) {
        body = extBody;
        return that;
    };
    that.getCode = function () {
        return code;
    };
}

//TODO create a complete object factory
//then when create pass the callback to start response processing
module.exports = {
    createResponse: function (terminate) {
        return new response(terminate);
    }
};
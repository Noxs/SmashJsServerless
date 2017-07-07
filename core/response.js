////TODO
//is it usefull to transform this in a class?
//TODO 
//message for some response are not used
function response() {
    var that = this;
    var code = null;
    var headers = {};
    var body = null;
    that.ok = function (extBody) {
        code = 200;
        body = extBody;
        return that;
    };
    that.created = function (extBody) {
        code = 201;
        body = extBody;
        return that;
    };
    that.noContent = function () {
        code = 204;
        body = null;
        return that;
    };
    that.badRequest = function (message) {
        code = 400;
        body = null;
        return that;
    };
    that.unauthorized = function (message) {
        code = 401;
        body = null;
        return that;
    };
    that.forbidden = function (message) {
        code = 403;
        body = null;
        return that;
    };
    that.notFound = function (message) {
        code = 404;
        body = null;
        return that;
    };
    that.conflict = function (message) {
        code = 409;
        body = null;
        return that;
    };
    that.internalServerError = function (message) {
        code = 500;
        body = null;
        return that;
    };
    that.notImplemented = function (message) {
        code = 501;
        body = null;
        return that;
    };
    that.serviceUnavailable = function (message) {
        code = 503;
        body = null;
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
    createResponse: function () {
        return new response();
    }
};
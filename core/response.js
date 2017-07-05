//TODO
//test if this works nice and if it easy to use
class Response {
    constructor() {
        this.code = null;
        this.code = null;
        this.headers = {};
        this.body = null;
    }
    get body() {
        return this.body;
    }
    set body(body) {
        this.body = body;
        return this;
    }
    get code() {
        return this.code;
    }
    set code(code) {
        this.code = code;
        return this;
    }
    get headers() {
        return this.headers;
    }
    set headers(headers) {
        this.headers = headers;
        return this;
    }
    ok(body) {
        this.code = 200;
        this.body = body;
        return this;
    }
    created(body) {
        this.code = 201;
        this.body = body;
        return this;
    }
    noContent() {
        this.code = 204;
        this.body = null;
        return this;
    }
    badRequest(message) {
        this.code = 400;
        this.body = null;
        return this;
    }
    unauthorized(message) {
        this.code = 401;
        this.body = null;
        return this;
    }
    forbidden(message) {
        this.code = 403;
        this.body = null;
        return this;
    }
    notFound(message) {
        this.code = 404;
        this.body = null;
        return this;
    }
    conflict(message) {
        this.code = 409;
        this.body = null;
        return this;
    }
    internalServerError(message) {
        this.code = 500;
        this.body = null;
        return this;
    }
    notImplemented(message) {
        this.code = 501;
        this.body = null;
        return this;
    }
    serviceUnavailable(message) {
        this.code = 503;
        this.body = null;
        return this;
    }
}
//
////TODO
//is it usefull to transform this in a class?
//TODO 
//message for some response are not used
var response = function () {
    var that = this;
    that.code = null;
    that.headers = {};
    that.body = null;
    var api = {
        ok: function (body) {
            that.code = 200;
            that.body = body;
            return that;
        },
        created: function (body) {
            that.code = 201;
            that.body = body;
            return that;
        },
        noContent: function () {
            that.code = 204;
            that.body = null;
            return that;
        },
        badRequest: function (message) {
            that.code = 400;
            that.body = null;
            return that;
        },
        unauthorized: function (message) {
            that.code = 401;
            that.body = null;
            return that;
        },
        forbidden: function (message) {
            that.code = 403;
            that.body = null;
            return that;
        },
        notFound: function (message) {
            that.code = 404;
            that.body = null;
            return that;
        },
        conflict: function (message) {
            that.code = 409;
            that.body = null;
            return that;
        },
        internalServerError: function (message) {
            that.code = 500;
            that.body = null;
            return that;
        },
        notImplemented: function (message) {
            that.code = 501;
            that.body = null;
            return that;
        },
        serviceUnavailable: function (message) {
            that.code = 503;
            that.body = null;
            return that;
        },
        setHeaders: function (headers) {
            //check if array type
            that.headers = headers;
            return that;
        },
        getHeaders: function () {
            return that.headers;
        },
        addHeader: function (key, value) {
            that.headers[key] = value;
            return that;
        },
        getBody: function () {
            return that.body;
        },
        setBody: function (body) {
            that.body = body;
            return that;
        },
        getCode: function () {
            return that.code;
        }
    };
    return api;
};
//TODO create a complete object factory
//then when create pass the callback to start response processing
module.exports = {
    createResponse: function () {
        return response();
    }
};
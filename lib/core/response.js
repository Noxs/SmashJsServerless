const Console = require("../util/console.js");

class Response extends Console {
    constructor(terminate) {
        super();
        if (typeof terminate !== 'object') {
            throw new Error("First parameter of new Response() must be a oject, " + this.typeOf(terminate) + " given");
        }
        if (typeof terminate.handleResponse !== 'function') {
            throw new Error("First parameter of new Response() must be a oject with a function called handleResponse, " + this.typeOf(terminate.handleResponse) + " given");
        }
        if (terminate.handleResponse.length !== 1) {
            throw new Error("First parameter of new Response() must be a function witch takes 1 parameter, " + terminate.handleResponse.length + " given");
        }
        this._terminate = terminate;
        this._code = null;
        this._headers = {};
        this._body = null;
    }

    ok(body) {
        this._code = 200;
        this._body = body;
        this.terminate();
        return this;
    }

    created(body) {
        this._code = 201;
        this._body = body;
        this.terminate();
        return this;
    }

    noContent() {
        this._code = 204;
        this._body = "";
        this.terminate();
        return this;
    }

    badRequest(message) {
        this._code = 400;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    unauthorized(message) {
        this._code = 401;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    forbidden(message) {
        this._code = 403;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    notFound(message) {
        this._code = 404;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    conflict(message) {
        this._code = 409;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    internalServerError(message) {
        this._code = 500;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    notImplemented(message) {
        this._code = 501;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    serviceUnavailable(message) {
        this._code = 503;
        this._body = "";
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    get headers() {
        return this._headers;
    }

    addHeader(key, value) {
        this._headers[key] = value;
        return this;
    }

    get body() {
        return this._body;
    }

    get stringifiedBody() {
        if (typeof this._body === 'object') {
            return JSON.stringify(this._body);
        } else {
            return this._body;
        }
    }

    set body(body) {
        this._body = body;
        return this;
    }

    get code() {
        return this._code;
    }

    terminate() {
        Object.freeze(this);
        this._terminate.handleResponse(this);
    }
}

module.exports = Response;
const smash = require("../../../../smash.js");

class Response extends smash.Console {
    constructor(terminate) {
        super();
        if (typeof terminate !== 'object') {
            throw new Error("First parameter of new Response() must be a object, " + this.typeOf(terminate));
        }
        if (typeof terminate.handleResponse !== 'function') {
            throw new Error("First parameter of new Response() must be a object with a function called handleResponse, " + this.typeOf(terminate.handleResponse));
        }
        if (terminate.handleResponse.length !== 1) {
            throw new Error("First parameter of new Response() must be a function witch takes 1 parameter, " + terminate.handleResponse.length + " given");
        }
        this._terminate = terminate;
        this._code = null;
        this._headers = {};
        this._body = null;
        this._errorResponse = {
            400: this.badRequest,
            401: this.unauthorized,
            403: this.forbidden,
            404: this.notFound,
            409: this.conflict,
            500: this.internalServerError,
            501: this.notImplemented,
            503: this.serviceUnavailable
        };
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
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    unauthorized(message) {
        this._code = 401;
        this._body = "";
        if (message) {
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    forbidden(message) {
        this._code = 403;
        this._body = "";
        if (message) {
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    notFound(message) {
        this._code = 404;
        this._body = "";
        if (message) {
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    conflict(message) {
        this._code = 409;
        this._body = "";
        if (message) {
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    internalServerError(message) {
        this._code = 500;
        this._body = "";
        if (message) {
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    notImplemented(message) {
        this._code = 501;
        this._body = "";
        if (message) {
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    serviceUnavailable(message) {
        this._code = 503;
        this._body = "";
        if (message) {
            this._body = { reason: message };
        }
        this.terminate();
        return this;
    }

    handleError(error) {
        if (error.constructor !== Error) {
            this.error("First parameter of handleError() must be an Error object, " + this.typeOf(error));
            this.internalServerError("Internal server error");
        } else {
            if (error.statusCode && this._response[error.statusCode]) {
                this._response[error.statusCode](error.message);
            } else {
                this.internalServerError("Internal server error");
            }
        }
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
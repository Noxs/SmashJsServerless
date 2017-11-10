
class Response {
    constructor(terminate) {
        if (typeof terminate !== 'function') {
            throw new Error("First parameter of new Response() must be a function, " + typeof terminate + " given");
        }
        if (terminate.length !== 1) {
            throw new Error("First parameter of new Response() must be a function witch takes 1 parameter, " + terminate.length + " given");
        }
        this._terminate = terminate;
        this._code = null;
        //load from config
        this._headers = {
            "Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
        };
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
        this._body = null;
        this.terminate();
        return this;
    }

    badRequest(message) {
        this._code = 400;
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    unauthorized(message) {
        this._code = 401;
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    forbidden(message) {
        this._code = 403;
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    notFound(message) {
        this._code = 404;
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    conflict(message) {
        this._code = 409;
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    internalServerError(message) {
        this._code = 500;
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    notImplemented(message) {
        this._code = 501;
        if (message) {
            this._body = {reason: message};
        }
        this.terminate();
        return this;
    }

    serviceUnavailable(message) {
        this._code = 503;
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

    set body(body) {
        this._body = body;
        return this;
    }

    get code() {
        return this._code;
    }

    terminate() {
        this._terminate(this);
    }
}

module.exports = Response;
const smash = require("../../../../smash.js");
const _ = require("lodash");
const LOCATION = "Location";

class Response extends smash.Console {
    constructor(terminate, request) {
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
        this._request = request;
        this._code = null;
        this._headers = {};
        this._body = null;
        this._errorResponse = {
            400: _.bind(this.badRequest, this),
            401: _.bind(this.unauthorized, this),
            403: _.bind(this.forbidden, this),
            404: _.bind(this.notFound, this),
            409: _.bind(this.conflict, this),
            500: _.bind(this.internalServerError, this),
            501: _.bind(this.notImplemented, this),
            503: _.bind(this.serviceUnavailable, this),
        };
    }

    _cleanAndAssign(body, optionalParameters) {
        return _.assign(_.mapValues(body, property => smash.binder.clean(this._request.route.action, property)), optionalParameters)
    }

    cleanOk(body, optionalParameters = {}) {
        if (smash.binder.cleanRuleExist(this._request.route.action) !== true) {
            return this.internalServerError();
        }
        return this.ok(this._cleanAndAssign(body, optionalParameters));
    }

    ok(body) {
        return this._baseSuccess(200, body);
    }

    created(body) {
        return this._baseSuccess(201, body);
    }

    cleanCreated(body, optionalParameters = {}) {
        if (smash.binder.cleanRuleExist(this._request.route.action) !== true) {
            return this.internalServerError();
        }
        return this.created(this._cleanAndAssign(body, optionalParameters));
    }

    accepted() {
        return this._baseSuccess(202);
    }

    noContent() {
        return this._baseSuccess(204);
    }

    _baseSuccess(code, body = "") {
        this._code = code;
        this._body = body;
        this.terminate();
        return this;
    }

    movedPermanently(url) {
        return this._baseRedirect(301, url);
    }

    found(url) {
        return this._baseRedirect(302, url);
    }

    temporaryRedirect(url) {
        return this._baseRedirect(307, url);
    }

    permanentRedirect(url) {
        return this._baseRedirect(308, url);
    }

    _baseRedirect(code, url) {
        this._code = code;
        this._headers[LOCATION] = url;
        this._body = "";
        this.terminate();
        return this;
    }

    badRequest(message, details) {
        return this._baseError(400, message, details);
    }

    unauthorized(message) {
        return this._baseError(401, message);
    }

    forbidden(message) {
        return this._baseError(403, message);
    }

    notFound(message) {
        return this._baseError(404, message);
    }

    conflict(message) {
        return this._baseError(409, message);
    }

    internalServerError(message) {        
        return this._baseError(500, message);
    }

    notImplemented(message) {
        return this._baseError(501, message);
    }

    serviceUnavailable(message) {
        return this._baseError(503, message);
    }

    _baseError(code, message, details) {
        this._code = code;
        this._body = message ? { reason: message, details } : "";
        this.terminate();
        return this;
    }

    handleError(error) {
        if (!error || error.constructor !== Error) {
            this.error("First parameter of handleError() must be an Error object, " + this.typeOf(error), error);
            this.internalServerError("Internal server error");
        } else {
            const handler = _.get(this._errorResponse, error.statusCode, _.bind(this.internalServerError))
            const message = _.get(error, 'message', 'Internal server error');
            handler(message);
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

    addHeaders(headers) {
        _.each(headers, (value, key) => {
            this.addHeader(key, value);
        }, this);
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

    set route(route) {
        this._route = route;
        return this;
    }

    get route() {
        return this._route;
    }
}

module.exports = Response;

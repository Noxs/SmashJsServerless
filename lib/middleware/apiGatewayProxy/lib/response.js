const _ = require("lodash");
const smash = require("../../../../smash.js");
const logger = smash.logger("Response");
const errorUtil = new smash.SmashError(logger);

class Response {
    constructor(terminate, request) {
        if (typeof terminate !== 'object') {
            throw new Error("First parameter of new Response() must be a object, " + smash.Logger.typeOf(terminate));
        }
        if (typeof terminate.handleResponse !== 'function') {
            throw new Error("First parameter of new Response() must be a object with a function called handleResponse, " + smash.Logger.typeOf(terminate.handleResponse));
        }
        if (terminate.handleResponse.length !== 1) {
            throw new Error("First parameter of new Response() must be a function witch takes 1 parameter, " + terminate.handleResponse.length + " given");
        }
        if (typeof terminate !== 'object') {
            throw new Error("Second parameter of new Response() must be a object, " + smash.Logger.typeOf(terminate));
        }
        this._terminate = terminate;
        this._request = request;
        this._code = null;
        this._headers = {};
        this._body = null;
    }

    get _errorPointer() {
        return {
            400: this.badRequest,
            401: this.unauthorized,
            403: this.forbidden,
            404: this.notFound,
            409: this.conflict,
            500: this.internalServerError,
            501: this.notImplemented,
            503: this.serviceUnavailable,
        }
    }

    _cleanAndAssign(body, optionalParameters) {
        if (smash.binder.cleanRuleExist(this._request.route.action) !== true) {
            return this.internalServerError();
        }
        return _.assign(_.mapValues(body, property => smash.clean(this._request.route.action, property)), optionalParameters)
    }

    cleanOk(body, optionalParameters = {}) {
        return this.ok(this._cleanAndAssign(body, optionalParameters));
    }

    ok(body) {
        return this._handleResponse(200, body);
    }

    created(body) {
        return this._handleResponse(201, body);
    }

    cleanCreated(body, optionalParameters = {}) {
        return this.created(this._cleanAndAssign(body, optionalParameters));
    }

    accepted() {
        return this._handleResponse(202);
    }

    noContent() {
        return this._handleResponse(204);
    }

    _getRedirectHeaders(url) {
        return { Location: url };
    }

    movedPermanently(url) {
        return this._handleResponse(301, "", this._getRedirectHeaders(url));
    }

    found(url) {
        return this._handleResponse(302, "", this._getRedirectHeaders(url));
    }

    temporaryRedirect(url) {
        return this._handleResponse(307, "", this._getRedirectHeaders(url));
    }

    permanentRedirect(url) {
        return this._handleResponse(308, "", this._getRedirectHeaders(url));
    }

    badRequest(message, details) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.badRequestError(message, details));
    }

    unauthorized(message) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.unauthorizedError(message));
    }

    forbidden(message) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.forbiddenError(message));
    }

    notFound(message) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.notFoundError(message));
    }

    conflict(message) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.conflictError(message));
    }

    internalServerError(message) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.internalServerError(message));
    }

    notImplemented(message) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.notImplementedError(message));
    }

    serviceUnavailable(message) {
        const errorUtil = new smash.SmashError();
        return this.handleError(errorUtil.serviceUnavailableError(message));
    }

    _handleResponse(code, body = "", headers = null) {
        this._code = code;
        this._body = body;
        this.addHeaders(headers);
        this.terminate();
        return this;
    }

    handleError(error) {
        if (errorUtil.isSmashError(error) === false) {
            error = errorUtil.internalServerError("First argument of handleError(error) must ba a SmashError, " + errorUtil.typeOf(error));
        }
        error.requestId = this._request.requestId;
        error.printError();
        return this._handleResponse(error.code, error.body);
    }

    get headers() {
        return this._headers;
    }

    addHeader(key, value) {
        this._headers[key] = value;
        return this;
    }

    addHeaders(headers = {}) {
        _.each(headers, (value, key) => {
            this.addHeader(key, value);
        }, this);
    }

    get body() {
        return this._body;
    }

    get stringifiedBody() {
        return typeof this._body === 'object' ? JSON.stringify(this._body) : this._body;
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

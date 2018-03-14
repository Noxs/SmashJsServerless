const smash = require("../../../smash.js");
const Next = require("./lib/next.js");
const Request = require("./lib/request.js");
const Response = require("./lib/response.js");
const Router = require("./lib/router.js");
const Route = require("./lib/route.js");
const UserProvider = require("./lib/userProvider.js");
const Authorization = require("./lib/authorization.js");
const path = require("path");
const USER_REPOSITORY_FILE = "apiGatewayProxy.user_repository.file";
const USER_REPOSITORY_DATABASE = "apiGatewayProxy.user_repository.database";
const RESPONSE_HEADERS_DEFAULT = "apiGatewayProxy.response.headers.default";

class ApiGatewayProxy extends Next {
    constructor() {
        super();
        this._smash = smash;
        this._router = new Router();
        this._userProvider = new UserProvider();
        this._authorization = new Authorization();
        this._link();
        this._registerUserRepository();
    }

    _registerUserRepository() {
        if (this.smash.config.get(USER_REPOSITORY_FILE)) {
            const file = this.smash.config.get(USER_REPOSITORY_FILE);
            const filePath = path.resolve(path.join(process.cwd(), file));
            try {
                this._attachUserRepository(require(filePath));
            } catch (error) {
                this.error("Failed to load user repository from file: " + file + " / " + filePath + " to user provider", error);
                throw new Error("Failed to load user repository from file: " + file + " / " + filePath + " to user provider");
            }
        } else if (this.smash.config.get(USER_REPOSITORY_DATABASE)) {
            const database = this.smash.config.get(USER_REPOSITORY_DATABASE);
            try {
                this._attachUserRepository(this.smash.database(database));
            } catch (error) {
                this.error("Failed to load user repository from database: " + database + " to user provider", error);
                throw new Error("Failed to load user repository from database: " + database + " to user provider");
            }
        }
        return this;
    }

    _attachUserRepository(module) {
        let instance = module;
        try {
            if (module.constructor === undefined && typeof module === 'function') {
                instance = new module();
            }
            this._userProvider.attachRepository(instance);
        } catch (error) {
            this.error("Failed to attach user repository: " + this.typeOf(instance), error);
            throw new Error("Failed to attach user repository: " + this.typeOf(instance));
        }
        return this;
    }

    get smash() {
        return this._smash;
    }

    get router() {
        return this._router;
    }

    get userProvider() {
        return this._userProvider;
    }

    get authorization() {
        return this._authorization;
    }

    _link() {
        this.setNext(this.router);
        this.router.setNext(this.userProvider);
        this.userProvider.setNext(this.authorization);
        this.authorization.setNext(this);
        return this;
    }

    attachUserRepository(repository) {
        this.userProvider.attachRepository(repository);
        return this;
    }

    _buildRequest(event, context) {
        const request = new Request(event, context);
        return request;
    }

    _buildResponse(event) {
        const response = new Response(this);
        const headers = this.smash.config.get(RESPONSE_HEADERS_DEFAULT);
        if (headers !== undefined) {
            for (let key in headers) {
                response.addHeader(key, headers[key]);
            }
        }
        return response;
    }

    handleEvent(event, context, callback) {
        if (typeof callback !== 'function') {
            throw new Error("Thrid parameter of handleEvent() must be a function, " + this.typeOf(callback));
        }
        this._callback = callback;
        const response = this._buildResponse(event);
        if (typeof event !== "object" || this.isEvent(event) === false) {
            this.error("Wrong type of event as argument to ApiGatewayProxy.handleEvent()");
            response.internalServerError("Internal server error");
        } else {
            const request = this._buildRequest(event, context);
            this.next(request, response);
        }
    }

    handleRequest(request, response) {
        if (request === undefined || request === null || request.constructor !== Request) {
            this.error("First parameter of handleRequest() must be Request object type, " + this.typeOf(request));
            response.internalServerError("Internal server error");
            return;
        }
        if (response === undefined || response === null || response.constructor !== Response) {
            this.error("Second parameter of handleRequest() must be Response object type, " + this.typeOf(response));
            response.internalServerError("Internal server error");
            return;
        }
        if (request.constructor !== Request || request.route.constructor !== Route) {
            this.error("Missing matched route in request");
            response.internalServerError("Internal server error");
            return;
        }
        this.info("Match route: " + request.route.method + " " + request.route.path + "; version: " + request.route.version + "; authorizations: " + (request.route.authorizations ? request.route.authorizations.join(" || ") : "None") + "; request: " + request.path + " in env: " + this.smash.getEnv("ENV") + " with user: " + request.user.username);
        request.route.callback.call(smash, request, response);
        return this;
    }

    handleResponse(response) {
        this.info("Response code: " + response.code);
        this._callback(null, {
            statusCode: response.code,
            headers: response.headers,
            body: response.stringifiedBody,
        });
        return this;
    }

    isEvent(event) {
        if (!event.httpMethod || !event.path) {
            return false;
        }
        return true;
    }

    get(route, callback) {
        //TODO error management
        const routeObject = this.router.get(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    post(route, callback) {
        //TODO error management
        const routeObject = this.router.post(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    put(route, callback) {
        //TODO error management
        const routeObject = this.router.put(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    delete(route, callback) {
        //TODO error management
        const routeObject = this.router.delete(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    patch(route, callback) {
        //TODO error management
        const routeObject = this.router.patch(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    options(route, callback) {
        //TODO error management
        const routeObject = this.router.options(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    head(route, callback) {
        //TODO error management
        const routeObject = this.router.head(route, callback);
        this.authorization.buildRouteAuthorizations(routeObject);
        return this;
    }

    expose() {
        return [
            {
                "functionName": "get",
                "function": "get"
            },
            {
                "functionName": "post",
                "function": "post"
            },
            {
                "functionName": "put",
                "function": "put"
            },
            {
                "functionName": "delete",
                "function": "delete"
            },
            {
                "functionName": "patch",
                "function": "patch"
            },
            {
                "functionName": "options",
                "function": "options"
            },
            {
                "functionName": "head",
                "function": "head"
            }
        ];
    }
}

module.exports = ApiGatewayProxy;
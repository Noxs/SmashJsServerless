const DEFAULT = require("./version.js");

class Request {
    constructor(event, context) {
        this.method = event.httpMethod;
        this.version = DEFAULT;
        if (event.queryStringParameters && (event.queryStringParameters.v || event.queryStringParameters.version)) {
            if (event.queryStringParameters.v) {
                this.version = event.queryStringParameters.v;
            } else {
                this.version = event.queryStringParameters.version;
            }
        }
        this.path = event.path;
        this.headers = event.headers;
        this.body = null;
        if (event.body) {
            this.body = JSON.parse(event.body);
        }
        this.parameters = {};
        if (event.queryStringParameters) {
            this.parameters = event.queryStringParameters;
        }
        this.user = null;
        if (event.requestContext && event.requestContext.authorizer && Object.keys(event.requestContext.authorizer).length > 0) {
            this.user = Object.assign({}, event.requestContext.authorizer);
        }
        if (event.requestContext.requestId) {
            this.requestId = event.requestContext.requestId;
        }
        if (event.requestContext && event.requestContext.identity && event.requestContext.identity.caller) {
            if (this.user === null) {
                this.user = {};
            }
            this.user.caller = event.requestContext.identity.caller;
        }
        if (event.requestContext && event.requestContext.identity && event.requestContext.identity.userArn) {
            if (this.user === null) {
                this.user = {};
            }
            this.user.userArn = event.requestContext.identity.userArn;
        }
        if (event.requestContext && event.requestContext.identity && event.requestContext.identity.user) {
            if (this.user === null) {
                this.user = {};
            }
            this.user.user = event.requestContext.identity.user;
        }
        this._route = null;
        this.routes = null;
        this.originalEvent = event;
        this.context = context;
    }

    set route(route) {
        this._route = route;
        Object.assign(this.parameters, route.parameters);
        return this;
    }

    get route() {
        return this._route;
    }

}

module.exports = Request;
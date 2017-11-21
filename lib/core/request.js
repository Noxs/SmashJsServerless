const DEFAULT = require("./version.js");
class Request {
    constructor(event) {
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
        if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.username) {
            this.user = {username: event.requestContext.authorizer.username, roles: null};
        }
        this._route = null;
        this.routes = null;
        this.originalEvent = event;
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
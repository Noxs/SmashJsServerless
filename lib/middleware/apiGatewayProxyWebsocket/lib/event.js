const smash = require("../../../../smash");
const logger = smash.logger("Event");
const errorUtil = new smash.SmashError(logger);
const DEFAULT = "$default"

class Event {
    constructor(rawEvent, context, terminate) {
        if (typeof rawEvent !== 'object') {
            throw new Error("First parameter of Event() must be an object, " + errorUtil.typeOf(rawEvent));
        }
        if (typeof terminate !== 'object') {
            throw new Error("Third parameter of Event() must be a object, " + errorUtil.typeOf(terminate));
        }
        if (typeof terminate.terminate !== 'function') {
            throw new Error("Third parameter of Event() must be an object with a function called terminate, " + errorUtil.typeOf(terminate.terminate));
        }
        if (terminate.terminate.length !== 2) {
            throw new Error("Third parameter of Event() must be an object with a function called terminate witch takes 2 parameters: error, data, " + terminate.terminate.length + " given");
        }
        this._terminate = terminate;
        Object.assign(this, rawEvent);
        this._rawEvent = rawEvent;
        this.keyword = rawEvent.requestContext.routeKey;
        this.connectionId = rawEvent.requestContext.connectionId;
        this.headers = rawEvent.headers;
        this.body = null;
        if (rawEvent.body) {
            rawEvent.body = JSON.parse(rawEvent.body);
            this.body = rawEvent.body.body;
        }
        if (this.keyword === DEFAULT) {
            this.keyword = rawEvent.body.action;
        }
        this.user = null;
        if (rawEvent.requestContext && rawEvent.requestContext.authorizer && Object.keys(rawEvent.requestContext.authorizer).length > 0) {
            this.user = Object.assign({}, rawEvent.requestContext.authorizer);
        }
        if (rawEvent.requestContext && rawEvent.requestContext.requestId) {
            this.requestId = rawEvent.requestContext.requestId;
        }
        if (rawEvent.requestContext && rawEvent.requestContext.identity && rawEvent.requestContext.identity.caller) {
            if (this.user === null) {
                this.user = {};
            }
            this.user.caller = rawEvent.requestContext.identity.caller;
        }
        if (rawEvent.requestContext && rawEvent.requestContext.identity && rawEvent.requestContext.identity.userArn) {
            if (this.user === null) {
                this.user = {};
            }
            this.user.userArn = rawEvent.requestContext.identity.userArn;
        }
        if (rawEvent.requestContext && rawEvent.requestContext.identity && rawEvent.requestContext.identity.user) {
            if (this.user === null) {
                this.user = {};
            }
            this.user.user = rawEvent.requestContext.identity.user;
        }
        this.context = context;
    }

    terminate(error, data) {
        this._terminate.terminate(error, data);
        return this;
    }

    success(data) {
        this.terminate(null, data);
        return this;
    }

    failure(error) {
        this.terminate(error, null);
        return this;
    }
}

module.exports = Event;

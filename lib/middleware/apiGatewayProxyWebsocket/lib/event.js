const smash = require("../../../../smash");
const logger = smash.logger("Event");
const errorUtil = new smash.SmashError(logger);
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
        this.headers = event.headers;
        /* this.body = null;
        if (event.body) {
            this.body = JSON.parse(event.body);
        } */
        /*         this.parameters = {};
                if (event.queryStringParameters) {
                    this.parameters = event.queryStringParameters;
                } */
        this.user = null;
        if (event.requestContext && event.requestContext.authorizer && Object.keys(event.requestContext.authorizer).length > 0) {
            this.user = Object.assign({}, event.requestContext.authorizer);
        }
        if (event.requestContext && event.requestContext.requestId) {
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

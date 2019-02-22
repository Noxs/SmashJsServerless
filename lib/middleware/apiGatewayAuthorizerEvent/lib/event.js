const smash = require("../../../../smash.js");
const Context = require("./context.js");

class Event extends smash.Console {
    constructor(rawEvent, context, terminate) {
        super();
        if (typeof rawEvent !== 'object') {
            throw new Error("First parameter of Event() must be an object, " + this.typeOf(rawEvent));
        }
        this._rawEvent = rawEvent;
        Object.assign(this, rawEvent);
        this.context = context;
        if (typeof terminate !== 'object') {
            throw new Error("Third parameter of Event() must be a object, " + this.typeOf(terminate));
        }
        if (typeof terminate.terminate !== 'function') {
            throw new Error("Third parameter of Event() must be an object with a function called terminate, " + this.typeOf(terminate.terminate));
        }
        if (terminate.terminate.length !== 2) {
            throw new Error("Third parameter of Event() must be an object with a function called terminate witch takes 2 parameters: error, data, " + terminate.terminate.length + " given");
        }
        if (rawEvent.requestContext.requestId) {
            this.requestId = rawEvent.requestContext.requestId
        }
        if (rawEvent.requestContext.domainName) {
            this.domainName = rawEvent.requestContext.domainName
        }
        if (rawEvent.requestContext.domainPrefix) {
            this.domainPrefix = rawEvent.requestContext.domainPrefix
        }
        if (rawEvent.requestContext.stage) {
            this.stage = rawEvent.requestContext.stage
        }
        if (rawEvent.requestContext.apiId) {
            this.apiId = rawEvent.requestContext.apiId
        }
        if (rawEvent.requestContext.httpMethod) {
            this.httpMethod = rawEvent.requestContext.httpMethod
        }
        this._terminate = terminate;
    }

    get Context() {
        return Context;
    }

    _generatePolicy(effect, context) {
        const authResponse = {
            principalId: context.principalId,
            context: context.rawObject()
        };
        if (effect && this.methodArn) {
            authResponse.policyDocument = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: context.resources
                    }
                ]
            };
        }
        return authResponse;
    };

    terminate(error, data) {
        this._terminate.terminate(error, data);
        return this;
    }

    allow(context) {
        if (context === undefined || context === null || context.constructor !== Context) {
            this.error("First parameter of allow(context) must be Context object type, " + this.typeOf(context));
            this.internalServerError();
            return this;
        }
        this.terminate(null, this._generatePolicy("Allow", context));
        return this;
    }

    deny(context) {
        if (context === undefined || context === null || context.constructor !== Context) {
            this.error("First parameter of deny(context) must be Context object type, " + this.typeOf(context));
            this.internalServerError();
            return this;
        }
        this.terminate(null, this._generatePolicy("Deny", context));
        return this;
    }

    unauthorized() {
        this.terminate("Unauthorized");
        return this;
    }

    invalidToken() {
        this.terminate("Invalid token");//FIX ME transform to a deny ? 
        return this;
    }

    internalServerError() {
        this.terminate("Internal server error");
        return this;
    }
}

module.exports = Event;
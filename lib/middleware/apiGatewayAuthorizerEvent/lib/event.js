const smash = require("../../../../smash.js");
const logger = smash.logger("EventType");
const errorUtil = new smash.SmashError(logger);
const Context = require("./context.js");
const DASH = "-";

class Event {
    constructor(rawEvent, context, terminate) {
        if (typeof rawEvent !== 'object') {
            throw new Error("First parameter of Event() must be an object, " + errorUtil.typeOf(rawEvent));
        }
        this._rawEvent = rawEvent;
        Object.assign(this, rawEvent);
        this.context = context;
        if (typeof terminate !== 'object') {
            throw new Error("Third parameter of Event() must be a object, " + errorUtil.typeOf(terminate));
        }
        if (typeof terminate.terminate !== 'function') {
            throw new Error("Third parameter of Event() must be an object with a function called terminate, " + errorUtil.typeOf(terminate.terminate));
        }
        if (terminate.terminate.length !== 2) {
            throw new Error("Third parameter of Event() must be an object with a function called terminate witch takes 2 parameters: error, data, " + terminate.terminate.length + " given");
        }
        if (rawEvent.requestContext.requestId) {
            this.requestId = rawEvent.requestContext.requestId;
        }
        if (rawEvent.requestContext.domainName) {
            this.domainName = rawEvent.requestContext.domainName;
        }
        if (rawEvent.requestContext.domainPrefix) {
            this.domainPrefix = rawEvent.requestContext.domainPrefix;
        }
        if (this.domainPrefix) {
            if (this.domainPrefix.indexOf(DASH) > 0) {
                this.service = this.domainPrefix.split(DASH);
                this.service.shift();
                this.service = this.service.join(DASH);
            } else {
                this.service = this.domainPrefix;
            }
        }
        if (rawEvent.requestContext.stage) {
            this.stage = rawEvent.requestContext.stage;
        }
        if (rawEvent.requestContext.apiId) {
            this.apiId = rawEvent.requestContext.apiId;
        }
        if (rawEvent.requestContext.httpMethod) {
            this.httpMethod = rawEvent.requestContext.httpMethod;
        }
        this._terminate = terminate;
        this._permissionContext = null;
    }

    generatePermissionContext(data) {
        this._permissionContext = new Context(data);
        return this._permissionContext;
    }

    get permissionContext() {
        return this._permissionContext;
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
                        Resource: smash.getCurrentEvent().methodArn,
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

    allow() {
        if (this.permissionContext === undefined || this.permissionContext === null || this.context.constructor !== Context) {
            logger.error("Method generateContext(data) must be called before allow(), " + errorUtil.typeOf(this.context));
            this.internalServerError();
            return this;
        }
        this.terminate(null, this._generatePolicy("Allow", this.permissionContext));
        return this;
    }

    deny() {
        if (this.permissionContext === undefined || this.permissionContext === null || this.permissionContext.constructor !== Context) {
            logger.error("Method generateContext(data) must be called before deny(), " + errorUtil.typeOf(this.permissionContext));
            this.internalServerError();
            return this;
        }
        this.terminate(null, this._generatePolicy("Deny", this.permissionContext));
        return this;
    }

    unauthorized(error) {
        logger.error("Unauthorized", error);
        this.terminate("Unauthorized");
        return this;
    }

    internalServerError(error) {
        if (errorUtil.isSmashError(error) === false) {
            error = errorUtil.internalServerError("First argument of handleError(error) must ba a SmashError, " + errorUtil.typeOf(error), error);
        }
        error.printError();
        this.terminate("Internal server error");
        return this;
    }

    handleError(error) {
        if (errorUtil.isSmashError(error) === false) {
            error = errorUtil.internalServerError("First argument of handleError(error) must ba a SmashError, " + errorUtil.typeOf(error), error);
        }
        error.printError();
        if (errorUtil.isUnauthorizedError(error) === true) {
            this.unauthorized(error);
        } else if (errorUtil.isForbiddenError(error) === true) {
            this.deny(error);
        } else {
            this.internalServerError(error);
        }
        return this;
    }
}

module.exports = Event;

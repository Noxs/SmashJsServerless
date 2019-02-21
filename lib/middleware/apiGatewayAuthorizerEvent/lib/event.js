const smash = require("../../../../smash.js");

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

    _generatePolicy(effect, username, id, roles, region, ip) {
        const authResponse = {
            principalId: id + ":" + username,
            context: { username: username, id: id, roles: roles, region: region, ip: ip }
        };
        try {
            authResponse.context["auth-request-id"] = smash.getEnv("awsRequestId");
        } catch (error) {
            this.info("Undefined request id");
        }
        if (effect && this.methodArn) {
            //this.debug("Method Arn", this.methodArn); make a rework of resources in the policy
            let resources = this.methodArn.split(":");
            resources.pop();
            resources = resources.join(":") + ":*";
            authResponse.policyDocument = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: effect,
                        Resource: resources
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

    allow(username, id, region, ip) {
        this.terminate(null, this._generatePolicy("Allow", username, id, region, ip));
        return this;
    }

    deny(username, id, region, ip) {
        this.terminate(null, this._generatePolicy("Deny", username, id, region, ip));
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
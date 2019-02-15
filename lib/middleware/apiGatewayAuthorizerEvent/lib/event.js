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
        this._terminate = terminate;
    }

    _generatePolicy(effect, username, id, roles, region, ip, type) {
        const authResponse = {
            principalId: id + ":" + username,
            context: { username: username, id: id, roles: roles, region: region, ip: ip, type: type }
        };
        try {
            authResponse.context["auth-request-id"] = smash.getEnv("awsRequestId");
        } catch (error) {
            this.info("Undefined request id");
        }
        if (effect && this.methodArn) {
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

    allow(username, id, region, ip, type) {
        this.terminate(null, this._generatePolicy("Allow", username, id, region, ip, type));
        return this;
    }

    deny(username, id, region, ip, type) {
        this.terminate(null, this._generatePolicy("Deny", username, id, region, ip, type));
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
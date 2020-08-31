const smash = require("../../../../smash.js");
const queryString = require("query-string");
const logger = smash.logger();
const errorUtil = smash.errorUtil();
const Context = require("./context.js");
const DASH = "-";

class Event {
	constructor(rawEvent, context, terminate) {
		if (typeof rawEvent !== 'object') {
			throw new errorUtil.TypeError("First parameter of Event() must be an object, ", rawEvent);
		}
		this._rawEvent = rawEvent;
		Object.assign(this, rawEvent);
		this.context = context;
		if (typeof terminate !== 'object') {
			throw new errorUtil.TypeError("Third parameter of Event() must be a object, ", terminate);
		}
		if (typeof terminate.terminate !== 'function') {
			throw new errorUtil.TypeError("Third parameter of Event() must be an object with a function called terminate, ", terminate.terminate);
		}
		if (terminate.terminate.length !== 2) {
			throw new Error("Third parameter of Event() must be an object with a function called terminate witch takes 2 parameters: error, data, " + terminate.terminate.length + " given");
		}
		this.requestContext = rawEvent.requestContext;
		this.processService();
		this.setupRequestId(rawEvent);
		this.apiId = this.requestContext.apiId;
		this.httpMethod = this.requestContext.httpMethod;
		this._terminate = terminate;
		this.permissionContext = null;
		this.extraContextData = {
			uriQuery: queryString.stringify(this._rawEvent.queryStringParameters),
			cookie: this._rawEvent.headers.Cookie,
		};
	}

	processService() {
		if (this.requestContext && this.requestContext.domainPrefix) {
			if (this.requestContext.domainPrefix.indexOf(DASH) > 0) {
				this.service = this.requestContext.domainPrefix.split(DASH);
				this.service.shift();
				this.service = this.service.join(DASH);
			} else {
				this.service = this.requestContext.domainPrefix;
			}
		}
		return this;
	}

	generatePermissionContext(data) {
		this.permissionContext = new Context(data);
		return this;
	}

	setupRequestId({ requestContext }) {
		if (requestContext && requestContext.requestId) {
			this.requestId = requestContext.requestId;
			logger.info("RequestId: " + this.requestId);
		}
		return this;
	}

	_generatePolicy(effect, context) {
		const authResponse = {
			principalId: context.principalId,
			context: { ...this.extraContextData, ...context.rawObject() },
		};
		if (effect && this.methodArn) {
			authResponse.policyDocument = {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: effect,
						Resource: smash.getCurrentEvent().methodArn,
					},
				],
			};
		}
		return authResponse;
	}

	terminate(error, data) {
		this._terminate.terminate(error, data);
		return this;
	}

	addExtraContextData(data) {
		this.extraContextData = { ...this.extraContextData, ...data };
		return this;
	}

	allow() {
		if (this.permissionContext) {
			this.terminate(null, this._generatePolicy("Allow", this.permissionContext));
		} else {
			this.internalServerError(errorUtil.internalServerError("Method generatePermissionContext(data) must be called before allow(), " + errorUtil.typeOf(this.permissionContext)));
		}
		return this;
	}

	deny() {
		if (this.permissionContext) {
			this.terminate(null, this._generatePolicy("Deny", this.permissionContext));
		} else {
			this.internalServerError(errorUtil.internalServerError("Method generatePermissionContext(data) must be called before deny(), " + errorUtil.typeOf(this.permissionContext)));
		}
		return this;
	}

	unauthorized(error) {
		if (error) {
			logger.error("Unauthorized", error);
		} else {
			logger.error("Unauthorized");
		}
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

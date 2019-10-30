const smash = require("../../../../smash");
const errorUtil = smash.errorUtil();
const DEFAULT = "$default";

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
			if (rawEvent.body.body) {
				this.body = rawEvent.body.body;
			}
		}
		if (this.keyword === DEFAULT) {
			if (rawEvent.body.action) {
				this.keyword = rawEvent.body.action;
			} else {
				this.keyword = null;
			}
		}
		this._extractRequestId(rawEvent);
		this._extractUser(rawEvent);
		this.context = context;
	}

	_extractRequestId({ requestContext }) {
		if (requestContext && requestContext.requestId) {
			this.requestId = requestContext.requestId;
		}
		return this;
	}

	_extractUser({ requestContext }) {
		this.user = null;
		if (requestContext) {
			if (requestContext.authorizer && Object.keys(requestContext.authorizer).length > 0) {
				this.user = Object.assign({}, requestContext.authorizer);
			}
			if (requestContext.identity) {
				if (this.user === null) {
					this.user = {};
				}
				this.user = { ...this.user, ...requestContext.identity };
			}
		}
		return this;
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

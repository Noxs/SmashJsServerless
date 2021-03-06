const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();
const attr = require('dynamodb-data-types').AttributeValue;

class Event {
	constructor(rawEvent, context, terminate) {
		if (typeof rawEvent !== 'object') {
			throw new Error("First parameter of Event() must be an object, " + errorUtil.typeOf(rawEvent));
		}
		if (typeof rawEvent.Records[0].eventName !== 'string') {
			throw new Error("Invalid raw event, invalid property eventName, " + errorUtil.typeOf(rawEvent.eventName));
		}
		if (typeof rawEvent.Records[0].eventSourceARN !== 'string') {
			throw new Error("Invalid raw event, invalid property eventSourceARN, " + errorUtil.typeOf(rawEvent.eventName));
		}
		this._rawEvent = rawEvent;
		Object.assign(this, rawEvent.Records[0]);
		this.type = rawEvent.Records[0].eventName;
		this.item = rawEvent.Records[0].dynamodb;
		if (this.item.OldImage)
			this.oldItem = attr.unwrap(this.item.OldImage);
		if (this.item.NewImage)
			this.newItem = attr.unwrap(this.item.NewImage);
		try {
			this.table = this._extractTableFromArn(rawEvent.Records[0].eventSourceARN);
		} catch (error) {
			throw new Error("Invalid raw event, invalid property eventSourceARN: " + rawEvent.Records[0].eventSourceARN);
		}
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
		this._terminate = terminate;
	}

	_extractTableFromArn(arn) {
		return arn.split("table/")[1].split("/stream")[0];
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

	handleError(error) {
		if (errorUtil.isSmashError(error) === false) {
			error = errorUtil.internalServerError("First argument of handleError(error) must be a SmashError, " + errorUtil.typeOf(error), error);
		}
		error.printError();
		return this.failure(error);
	}
}

module.exports = Event;

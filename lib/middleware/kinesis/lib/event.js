const smash = require("../../../../smash.js");
const Record = require("./record.js");
const errorUtil = smash.errorUtil();

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
		this._extractStreamInfos(rawEvent);
		this.context = context;
		this._extractMessage(rawEvent);
	}

	_extractStreamInfos(rawEvent) {
		const splittedArn = rawEvent.Records[0].eventSourceARN.split(":");
		const streamInfos = splittedArn.pop().split("-");
		this.project = streamInfos.shift();
		this.streamName = streamInfos.shift();
		this.env = streamInfos.shift();
		this.region = streamInfos.join("-");
		console.log("______________extractStreamInfos", this.project, this.streamName, this.env, this.env);
		return this;
	}

	_extractMessage(rawEvent) {
		this.records = rawEvent.records.map(record => new Record(record));
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

	handleError(error) {
		if (errorUtil.isSmashError(error) === false) {
			error = errorUtil.internalServerError("First argument of handleError(error) must be a SmashError, " + errorUtil.typeOf(error), error);
		}
		error.printError();
		return this.failure(error);
	}
}

module.exports = Event;

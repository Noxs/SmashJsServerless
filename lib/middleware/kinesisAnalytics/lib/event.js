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
		this._extractTopicInfos(rawEvent);
		this.context = context;
		this._extractMessage(rawEvent);
	}

	_extractTopicInfos(rawEvent) {
		const splittedArn = rawEvent.applicationArn.split(":");
		const topicInfos = splittedArn.pop().split("-");
		this.project = topicInfos.shift();
		this.application = topicInfos.shift();
		this.env = topicInfos.shift();
		this.region = topicInfos.join("-");
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

	success() {
		this.terminate(null, { records: this.records });
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

const smash = require("../../../../smash.js");
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
		const splittedArn = rawEvent.Records[0].eventSourceARN.split(":");
		const topicInfos = splittedArn.pop().split("-");
		this.project = topicInfos.shift();
		this.queue = topicInfos.shift();
		this.env = topicInfos.shift();
		this.region = topicInfos.join("-");
		return this;
	}

	_extractMessage(rawEvent) {
		const originalMessage = rawEvent.Records[0].body;
		try {
			this.message = JSON.parse(originalMessage);
		} catch (error) {
			const messages = originalMessage.split("\n");
			this.message = {};
			messages.forEach(message => {
				if (message) {
					const content = message.split("=");
					if (content.length === 1 || (content.length === 2 && !content[1])) {
						throw new Error("Unsupported message type: " + originalMessage);
					} else if (content.length > 1) {
						const key = content.shift();
						let value = content.join("=");
						if (value.charAt(0) === "'") {
							value = value.substr(1);
						}
						if (value.charAt(value.length - 1) === "'") {
							value = value.slice(0, -1);
						}
						try {
							this.message[key] = JSON.parse(value);
						} catch (error) {
							this.message[key] = value;
						}
					}
				}
			});
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

	handleError(error) {
		if (errorUtil.isSmashError(error) === false) {
			error = errorUtil.internalServerError("First argument of handleError(error) must be a SmashError, " + errorUtil.typeOf(error), error);
		}
		error.printError();
		return this.failure(error);
	}
}

module.exports = Event;

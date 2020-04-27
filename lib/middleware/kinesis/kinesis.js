const smash = require("../../../smash");
const logger = smash.logger();
const errorUtil = smash.errorUtil();
const EventType = require("./lib/eventType");
const Event = require("./lib/event");

class Kinesis {
	constructor() {
		this._events = [];
	}

	get smash() {
		return smash;
	}

	_matchEvents(event) {
		const events = [];
		for (let i = 0, length = this._events.length; i < length; i++) {
			if (this._events[i].match(event) === true) {
				events.push(this._events[i]);
			}
		}
		return events;
	}

	async handleEvent(rawEvent, context, callback) {
		if (typeof callback !== 'function') {
			throw new Error("Third parameter of handleEvent() must be a function, " + errorUtil.typeOf(callback) + " given");
		}
		this._callback = callback;
		const event = new Event(rawEvent, context, this);
		const matchedEvents = this._matchEvents(event);
		if (matchedEvents.length === 0) {
			logger.info("No event found for: " + event.streamName);
			this.terminate(new Error("No event found for: " + event.streamName));
		} else if (matchedEvents.length > 1) {
			logger.error("More than 1 match for the event: " + event.streamName);
			this.terminate(new Error("More than 1 match for the event: " + event.streamName));
		} else {
			logger.info("Match event source: " + event.streamName);
			smash.setCurrentEvent(event);
			try {
				await matchedEvents[0].callback.call(smash, event);
			} catch (error) {
				event.handleError(error);
			}
			return this;
		}
	}

	terminate(error, data) {
		if (error) {
			logger.info("Result => Failure");
		} else {
			logger.info("Result => Success");
		}
		this._callback(error, data);
		return this;
	}

	isEvent(event) {
		return event.Records && event.Records[0] && event.Records[0].eventSource === 'aws:kinesis';
	}

	event(stream, callback) {
		const event = new EventType(stream, callback);
		this._events.push(event);
		return this;
	}

	getHandlers() {
		return this._events;
	}

	expose() {
		return [
			{
				"functionName": "kinesis",
				"function": "event",
			},
		];
	}
}

module.exports = Kinesis;

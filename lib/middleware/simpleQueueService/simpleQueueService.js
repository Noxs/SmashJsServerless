const smash = require("../../../smash");
const logger = smash.logger();
const errorUtil = smash.errorUtil();
const EventType = require("./lib/eventType");
const Event = require("./lib/event");

class SimpleQueueService {
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
			logger.info("No event found for: " + event.queue);
			this.terminate(new Error("No event found for: " + event.queue));
		} else if (matchedEvents.length > 1) {
			logger.error("More than 1 match for the event: " + event.queue);
			this.terminate(new Error("More than 1 match for the event: " + event.queue));
		} else {
			logger.info("Match event source: " + event.queue);
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
		smash.clearSingleton();
		if (error) {
			logger.info("Result => Failure");
		} else {
			logger.info("Result => Success");
		}
		this._callback(error, data);
		return this;
	}

	isEvent(event) {
		return Boolean(event.Records && event.Records[0] && event.Records[0].eventSource === 'aws:sqs');
	}

	event(notification, callback) {
		const event = new EventType(notification, callback);
		this._events.push(event);
		return this;
	}

	getHandlers() {
		return this._events;
	}

	expose() {
		return [
			{
				"functionName": "simpleQueueService",
				"function": "event",
			},
		];
	}
}

module.exports = SimpleQueueService;

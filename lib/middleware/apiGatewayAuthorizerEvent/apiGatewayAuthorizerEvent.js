const smash = require("../../../smash.js");
const logger = smash.logger();
const errorUtil = smash.errorUtil();
const EventType = require("./lib/eventType.js");
const Event = require("./lib/event.js");

class ApiGatewayAuthorizerEvent {
	constructor() {
		this.events = [];
	}

	_matchEvents(eventToMatch) {
		return this.events.find(event => event.match(eventToMatch));
	}

	async handleEvent(rawEvent, context, callback) {
		if (typeof callback !== 'function') {
			throw new errorUtil.TypeError("Third parameter of handleEvent() must be a function, ", callback);
		}
		this._callback = callback;
		const event = new Event(rawEvent, context, this);
		const matchedEvent = this._matchEvents(event);
		if (matchedEvent) {
			logger.info("Match event");
			smash.setCurrentEvent(event);
			try {
				await matchedEvent.callback.call(smash, event);
			} catch (error) {
				event.handleError(error);
			}
		} else {
			logger.info("No event found");
			this.terminate(new Error("No event found"));
		}
		return this;
	}

	terminate(error, data) {
		if (error) {
			logger.info("Result => Failure", error);
		} else {
			logger.info("Result => Success");
		}
		this._callback(error, data);
		return this;
	}


	isEvent(event) {
		return event.type === "REQUEST";
	}

	event(callback) {
		this.events.push(new EventType(callback));
		return this;
	}

	getHandlers() {
		return this.events;
	}

	expose() {
		return [
			{
				"functionName": "apiGatewayAuthorizerEvent",
				"function": "event",
			},
		];
	}
}

module.exports = ApiGatewayAuthorizerEvent;

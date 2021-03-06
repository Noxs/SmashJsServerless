const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class EventType {
	constructor(notification, callback) {
		if (typeof notification !== 'object') {
			throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(notification));
		}
		if (typeof notification.channel !== 'string') {
			throw new Error("First parameter of EventType() must have a string property called channel, " + errorUtil.typeOf(notification.channel));
		}
		this._channel = notification.channel;
		if (typeof callback !== 'function') {
			throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
		}
		if (callback.length !== 1) {
			throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
		}
		this._callback = callback;
	}

	get channel() {
		return this._channel;
	}

	get callback() {
		return this._callback;
	}

	match(event) {
		return event.channel === this.channel;
	}
}

module.exports = EventType;

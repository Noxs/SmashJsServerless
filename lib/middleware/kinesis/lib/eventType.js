const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class EventType {
	constructor(stream, callback) {
		if (typeof stream !== 'object') {
			throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(stream));
		}
		if (typeof stream.name !== 'string') {
			throw new Error("First parameter of EventType() must have a string property called name, " + errorUtil.typeOf(stream.name));
		}
		this._streamName = stream.name;
		if (typeof callback !== 'function') {
			throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
		}
		if (callback.length !== 1) {
			throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
		}
		this._callback = callback;
	}

	get name() {
		return this._streamName;
	}

	get callback() {
		return this._callback;
	}

	match(event) {
		return event.name === this.name;
	}
}

module.exports = EventType;

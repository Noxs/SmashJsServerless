const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class EventType {
	constructor(stream, callback) {
		if (typeof stream !== 'object') {
			throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(stream));
		}
		if (typeof stream.application !== 'string') {
			throw new Error("First parameter of EventType() must have a string property called application, " + errorUtil.typeOf(stream.application));
		}
		this._application = stream.application;
		this._stream = stream.stream;
		if (typeof callback !== 'function') {
			throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
		}
		if (callback.length !== 1) {
			throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
		}
		this._callback = callback;
	}

	get application() {
		return this._application;
	}

	get stream() {
		return this._stream;
	}

	get callback() {
		return this._callback;
	}

	match(event) {
		if (event.application !== this.application) {
			return false;
		}
		return true;
	}
}

module.exports = EventType;

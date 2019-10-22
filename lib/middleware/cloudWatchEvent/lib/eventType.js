const smash = require("../../../../smash.js");
const logger = smash.logger("EventType");
const errorUtil = new smash.SmashError(logger);
class EventType {
	constructor(route, callback) {
		if (typeof route !== 'object') {
			throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(route));
		}
		if (typeof route.source !== 'string') {
			throw new Error("First parameter of EventType() must have a string property called source, " + errorUtil.typeOf(route.source));
		}
		this._source = route.source;
		if (typeof route.version !== 'string') {
			throw new Error("First parameter of EventType() must have a string property called version, " + errorUtil.typeOf(route.version));
		}
		this._version = route.version;
		if (typeof callback !== 'function') {
			throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
		}
		if (callback.length !== 1) {
			throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
		}
		this._callback = callback;
	}

	get source() {
		return this._source;
	}

	get version() {
		return this._version;
	}

	get callback() {
		return this._callback;
	}

	match(event) {
		if (event.source === this.source && event.version === this.version) {
			return true;
		}
		return false;
	}
}

module.exports = EventType;

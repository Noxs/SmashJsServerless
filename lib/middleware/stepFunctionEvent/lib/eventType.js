const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class EventType {
	constructor(route, callback) {
		if (typeof route !== 'object') {
			throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(route));
		}
		if (typeof route.name !== 'string') {
			throw new Error("First parameter of EventType() must have a string property called name, " + errorUtil.typeOf(route.name));
		}
		this._name = route.name;
		if (typeof callback !== 'function') {
			throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
		}
		if (callback.length !== 1) {
			throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
		}
		this._callback = callback;
	}

	get name() {
		return this._name;
	}

	get callback() {
		return this._callback;
	}

	match(event) {
		return event.name === this.name;
	}
}

module.exports = EventType;

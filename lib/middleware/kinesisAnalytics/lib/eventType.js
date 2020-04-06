const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class EventType {
	constructor(kinesisAnalytics, callback) {
		if (typeof kinesisAnalytics !== 'object') {
			throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(kinesisAnalytics));
		}
		if (typeof kinesisAnalytics.application !== 'string') {
			throw new Error("First parameter of EventType() must have a string property called queue, " + errorUtil.typeOf(kinesisAnalytics.application));
		}
		this._application = kinesisAnalytics.application;
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

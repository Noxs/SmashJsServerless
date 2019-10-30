const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class EventType {
	constructor(...args) {
		const [route, callback] = args;
		if (args.length < 1 || args.length > 2) {
			throw new Error("EventType(optionalRoute, callback) could have 1 or 2 parameters, has : " + args.length + " parameter(s)");
		}
		if (args.length === 1) {
			this._task = null;
			if (typeof args[0] !== 'function') {
				throw new Error("First parameter of EventType() must be a function, " + errorUtil.typeOf(args[0]));
			}
			if (args[0].length !== 1) {
				throw new Error("First parameter of EventType() must be a function witch takes 1 parameter: Event, " + args[0].length + " given");
			}
			this._callback = args[0];
		} else {
			if (typeof route !== 'object') {
				throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(route));
			}
			if (typeof route.task !== 'string') {
				throw new Error("First parameter of EventType() must have a string property called type, " + errorUtil.typeOf(route.task));
			}
			this._task = route.task;

			if (typeof callback !== 'function') {
				throw new Error("Second parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
			}
			if (callback.length !== 1) {
				throw new Error("Second parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
			}
			this._callback = callback;
		}
	}

	get callback() {
		return this._callback;
	}

	get task() {
		return this._task;
	}

	match(event) {
		if (event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters) {
			return this.task === event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;
		}
		if (this.task === null) {
			return true;
		}
		return false;
	}
}

module.exports = EventType;

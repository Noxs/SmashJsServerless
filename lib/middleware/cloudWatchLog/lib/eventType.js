const smash = require("../../../../smash.js");
const logger = smash.logger("EventType");
const errorUtil = new smash.SmashError(logger);

class EventType {
    constructor(callback) {
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
        }
        if (callback.length !== 1) {
            throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
        }
        this._callback = callback;
    }

    get callback() {
        return this._callback;
    }

    match(event) {
        return true;
    }
}

module.exports = EventType;

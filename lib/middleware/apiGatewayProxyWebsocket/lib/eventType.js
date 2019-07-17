const smash = require("../../../../smash");
const logger = smash.logger("EventType");
const errorUtil = new smash.SmashError(logger);

class EventType {
    constructor(route, callback) {
        if (typeof route !== 'object') {
            throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(route));
        }
        if (typeof route.keyword !== 'string') {
            throw new Error("First parameter of EventType() must have a string property called keyword, " + errorUtil.typeOf(route.keyword));
        }
        this._keyword = route.keyword;
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
        }
        if (callback.length !== 1) {
            throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
        }
        this._callback = callback;
    }

    get keyword() {
        return this._keyword;
    }

    get callback() {
        return this._callback;
    }

    match(event) {
        if (event.keyword === this._keyword) {
            return true;
        }
        return false;
    }
}

module.exports = EventType;

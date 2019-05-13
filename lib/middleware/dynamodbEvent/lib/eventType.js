const smash = require("../../../../smash.js");
const logger = smash.logger("EventType");
const errorUtil = new smash.SmashError(logger);
const ENV = "{$ENV}";

class EventType {
    constructor(route, callback) {
        if (typeof route !== 'object') {
            throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(route));
        }
        if (typeof route.type !== 'string') {
            throw new Error("First parameter of EventType() must have a string property called type, " + errorUtil.typeOf(route.source));
        }
        this._type = route.type;
        if (typeof route.table !== 'string') {
            throw new Error("First parameter of EventType() must have a string property called table, " + errorUtil.typeOf(route.version));
        }
        this._table = route.table;
        if (this._table.indexOf(ENV) !== -1) {
            this._table.split(ENV).join(smash.getEnv("ENV"));
        }
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
        }
        if (callback.length !== 1) {
            throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
        }
        this._callback = callback;
    }

    get source() {
        return this._type;
    }

    get table() {
        return this._table;
    }

    get callback() {
        return this._callback;
    }

    match(event) {
        if (event.eventName !== this.type) {
            return false;
        }
        if (event.table !== this.table) {
            return false;
        }
        return true;
    }
}

module.exports = EventType;

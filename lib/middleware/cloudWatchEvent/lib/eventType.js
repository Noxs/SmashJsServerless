const smash = require("../../../../smash.js");

class EventType extends smash.Console {
    constructor(route, callback) {
        super();
        if (typeof route !== 'object') {
            throw new Error("First parameter of EventType() must be an object, " + this.typeOf(route) + " given");
        }
        if (typeof route.source !== 'string') {
            throw new Error("First parameter of EventType() must have a string property called source, " + this.typeOf(route.source) + " given");
        }
        this._source = route.source;
        if (typeof route.version !== 'string') {
            throw new Error("First parameter of EventType() must have a string property called version, " + this.typeOf(route.version) + " given");
        }
        this._version = route.version;
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of EventType() must be a function, " + this.typeOf(callback) + " given");
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

    success(data) {
        this.terminate(null, data);
        return this;
    }

    failure(error) {
        this.terminate(error, null);
        return this;
    }

    match(event) {
        if (event.source !== this._source) {
            return false;
        }
        if (event.version !== this._version) {
            return false;
        }
        return true;
    }
}

module.exports = EventType;
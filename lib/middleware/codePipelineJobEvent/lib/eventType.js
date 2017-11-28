const smash = require("../../../../smash.js");

class EventType extends smash.Console {
    constructor(callback) {
        super();
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of EventType() must be a function, " + this.typeOf(callback) + " given");
        }
        if (callback.length !== 1) {
            throw new Error("Third parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
        }
        this._callback = callback;
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
        return true;
    }
}

module.exports = EventType;
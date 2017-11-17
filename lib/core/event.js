
class Event {
    constructor(source, version, callback) {
        if (typeof source !== 'string') {
            throw new Error("First parameter of Event() must be a string, " + this.typeOf(source) + " given");
        }
        this._source = source;
        if (typeof version !== 'string') {
            throw new Error("Second parameter of Event() must be a string, " + this.typeOf(version) + " given");
        }
        this._version = version;
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of Event() must be a function, " + this.typeOf(callback) + " given");
        }
        if (callback.length !== 1) {
            throw new Error("Third parameter of Event() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
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
        if (event.source !== this._source) {
            return false;
        }
        if (event.version !== this._version) {
            return false;
        }
        return true;
    }
}

module.exports = Event;
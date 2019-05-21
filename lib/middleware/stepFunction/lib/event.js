const smash = require("../../../../smash.js");
const logger = smash.logger("Event");
const errorUtil = new smash.SmashError(logger);

class Event {
    constructor(rawEvent, context, terminate) {
        if (typeof rawEvent !== 'object') {
            throw new Error("First parameter of Event() must be an object, " + errorUtil.typeOf(rawEvent));
        }
        if (typeof rawEvent.EventSource !== 'string') {
            throw new Error("Invalid raw event, invalid property EventSource, " + errorUtil.typeOf(rawEvent.EventSource));
        }
        if (typeof rawEvent.Route !== 'string') {
            throw new Error("Invalid raw event, invalid property eventSourceARN, " + errorUtil.typeOf(rawEvent.Route));
        }
        this.name = rawEvent.Route
        this._rawEvent = rawEvent;
        Object.assign(this, rawEvent);
        this.context = context;
        if (typeof terminate !== 'object') {
            throw new Error("Third parameter of Event() must be a object, " + errorUtil.typeOf(terminate));
        }
        if (typeof terminate.terminate !== 'function') {
            throw new Error("Third parameter of Event() must be an object with a function called terminate, " + errorUtil.typeOf(terminate.terminate));
        }
        if (terminate.terminate.length !== 2) {
            throw new Error("Third parameter of Event() must be an object with a function called terminate witch takes 2 parameters: error, data, " + terminate.terminate.length + " given");
        }
        this._terminate = terminate;
    }

    terminate(error, data) {
        this._terminate.terminate(error, data);
        return this;
    }

    success(data) {
        this.terminate(null, data);
        return this;
    }

    failure(error) {
        this.terminate(error, null);
        return this;
    }
}

module.exports = Event;

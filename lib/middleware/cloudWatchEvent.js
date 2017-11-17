const Next = require("../core/next.js");
const Event = require("../core/event.js");
const smash = require("../../smash.js");

class CloudWatchEvent extends Next {
    constructor() {
        super();
        this._smash = smash;
        //TODO
        //this._link();
        this._events = [];
    }

    get smash() {
        return this._smash;
    }

    _matchEvents(event) {
        const events = [];
        for (let i = 0, length = this._events.length; i < length; i++) {
            if (this._events[i].match(event) === true) {
                events.push(this._events[i]);
            }
        }
        return events;
    }

    handleEvent(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error("Second parameter of handleEvent() must be a function, " + this.typeOf(callback) + " given");
        }
        this._callback = callback;
        const matchedEvents = this._matchEvents(event);
        if (matchedEvents.length === 0) {
            this.info("No event found for ", event.source, event.version);
            //response.notFound("Not found");
            //TODO
        } else {
            //todo
            this.info("Match event source: " + event.source + " version: " + event.version + " in env: " + this.smash.getEnv("ENV"));
            event.callback(event);
            return this;
        }
    }

    isEvent(event) {
        if (!event.source || !event.version) {
            return false;
        }
        return true;
    }

    event(source, version, callback) {
        const event = new Event(source, version, callback);
        this._events.push(event);
        return this;
    }
}

module.exports = CloudWatchEvent;
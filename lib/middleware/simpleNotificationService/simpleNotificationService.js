const smash = require("../../../smash.js");
const EventType = require("./lib/eventType.js");
const Event = require("./lib/event.js");

class SimpleNotificationService extends smash.Console {
    constructor() {
        super();
        this._smash = smash;
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

    handleEvent(rawEvent, context, callback) {
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of handleEvent() must be a function, " + this.typeOf(callback) + " given");
        }
        this._callback = callback;
        const event = new Event(rawEvent, context, this);
        const matchedEvents = this._matchEvents(event);
        if (matchedEvents.length === 0) {
            this.info("No event found for: " + event.channel);
            this.terminate(new Error("No event found for: " + event.channel));
        } else if (matchedEvents.length > 1) {
            this.error("More than 1 match for the event: " + event.channel);
            this.terminate(new Error("More than 1 match for the event: " + event.channel));
        } else {
            this.info("SimpleNotificationService match event source: " + event.channel + " in env: " + this.smash.getEnv("ENV"));
            matchedEvents[0].callback.call(smash, event);
            return this;
        }
    }

    terminate(error, data) {
        this._callback(error, data);
        return this;
    }

    isEvent(event) {
        if (!event.Records || !event.Records[0] || event.Records[0].EventSource !== 'aws:sns') {
            return false;
        }
        return true;
    }

    event(notification, callback) {
        const event = new EventType(notification, callback);
        this._events.push(event);
        return this;
    }

    expose() {
        return [
            {
                "functionName": "simpleNotificationService",
                "function": "event"
            }
        ];
    }
}

module.exports = SimpleNotificationService;
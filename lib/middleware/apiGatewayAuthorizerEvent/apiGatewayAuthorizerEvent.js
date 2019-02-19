const smash = require("../../../smash.js");
const EventType = require("./lib/eventType.js");
const Event = require("./lib/event.js");

class ApiGatewayAuthorizerEvent extends smash.Console {
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
            this.info("No event found");
            this.terminate(new Error("No event found"));
        } else if (matchedEvents.length > 1) {
            this.error("More than 1 match for the event");
            this.terminate(new Error("More than 1 match for the event"));
        } else {
            this.info("ApiGatewayAuthorizerEvent match event in env: " + this.smash.getEnv("ENV"));
            matchedEvents[0].callback.call(smash, event);
            return this;
        }
    }

    terminate(error, data) {
        this._callback(error, data);
        return this;
    }

    isEvent(event) {
        if (event.type === "TOKEN" || event.type === "REQUEST") {
            return true;
        }
        return false;
    }

    event(route, callback) {
        const event = new EventType(route, callback);
        this._events.push(event);
        return this;
    }

    expose() {
        return [
            {
                "functionName": "apiGatewayAuthorizerEvent",
                "function": "event"
            }
        ];
    }
}

module.exports = ApiGatewayAuthorizerEvent;
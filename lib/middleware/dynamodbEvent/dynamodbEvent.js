const smash = require("../../../smash.js");
const logger = smash.logger("DynamodbEvent");
const errorUtil = new smash.SmashError(logger);
const EventType = require("./lib/eventType.js");
const Event = require("./lib/event.js");

class DynamodbEvent {
    constructor() {
        this._events = [];
    }

    get smash() {
        return smash;
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
            throw new Error("Third parameter of handleEvent() must be a function, " + errorUtil.typeOf(callback) + " given");
        }
        this._callback = callback;
        const event = new Event(rawEvent, context, this);
        const matchedEvents = this._matchEvents(event);
        if (matchedEvents.length === 0) {
            logger.info("No event found");
            this.terminate(new Error("No event found"));
        } else if (matchedEvents.length > 1) {
            logger.error("More than 1 match for the event");
            this.terminate(new Error("More than 1 match for the event"));
        } else {
            logger.info("Match event " + event.type + " " + event.table + "in env: " + smash.getEnv("ENV"));
            smash.setCurrentEvent(event);
            matchedEvents[0].callback.call(smash, event);
            return this;
        }
    }

    terminate(error, data) {
        if (error) {
            logger.info("Result => Failure");
        } else {
            logger.info("Result => Success");
        }
        this._callback(error, data);
        return this;
    }

    isEvent(event) {
        if (!event.Records || !event.Records[0] || event.Records[0].EventSource !== 'aws:dynamodb') {
            return false;
        }
        return true;
    }

    event(route, callback) {
        const event = new EventType(route, callback);
        this._events.push(event);
        return this;
    }

    getHandlers() {
        return this._events;
    }

    expose() {
        return [
            {
                "functionName": "dynamodbEvent",
                "function": "event"
            }
        ];
    }
}

module.exports = DynamodbEvent;
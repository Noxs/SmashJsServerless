const smash = require("../../../smash");
const logger = smash.logger("ApiGatewayProxyWebsocket");
const errorUtil = new smash.SmashError(logger);
const EventType = require("./lib/eventType");
const Event = require("./lib/event");

class apiGatewayProxyWebsocket {
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

    async handleEvent(rawEvent, context, callback) {
        if (typeof callback !== 'function') {
            throw new Error("Third parameter of handleEvent() must be a function, " + errorUtil.typeOf(callback) + " given");
        }
        this._callback = callback;
        const event = new Event(rawEvent, context, this);
        const matchedEvents = this._matchEvents(event);
        if (matchedEvents.length === 0) {
            logger.info("No event found for: " + event.keyword);
            this.terminate(new Error("No event found for: " + event.keyword));
        } else if (matchedEvents.length > 1) {
            logger.error("More than 1 match for the event: " + event.keyword);
            this.terminate(new Error("More than 1 match for the event: " + event.keyword));
        } else {
            logger.info("Match event keyword: " + event.keyword + " in env: " + smash.getEnv("ENV"));
            smash.setCurrentEvent(event);
            try {
                await matchedEvents[0].callback.call(smash, event);
            } catch (error) {
                event.failure(error);
            }
            return this;
        }
    }

    terminate(error, data) {
        if (error) {
            logger.error("Result => Failure", error);
        } else {
            logger.info("Result => Success");
        }
        this._callback(error, data);
        return this;
    }

    isEvent(event) {
        if (event.requestContext && event.requestContext.routeKey) {
            return true;
        }
        return false;
    }

    websocket(route, callback) {
        const event = new EventType(route, callback);
        this._events.push(event);
        return this;
    }

    disconnect(connectionId) {
        return new Promise((resolve, reject) => {
            //TODO
        });
    }

    send(connectionId, message) {
        return new Promise((resolve, reject) => {
            //TODO
        });
    }

    status(connectionId) {
        return new Promise((resolve, reject) => {
            //TODO
        });
    }

    getHandlers() {
        return this._events;
    }

    expose() {
        return [
            {
                "functionName": "websocket",
                "function": "websocket"
            },
            {
                "functionName": "disconnect",
                "function": "disconnect"
            },
            {
                "functionName": "send",
                "function": "send"
            },
            {
                "functionName": "status",
                "function": "status"
            },
        ];
    }
}

module.exports = apiGatewayProxyWebsocket;

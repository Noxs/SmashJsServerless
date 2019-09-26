const smash = require("../../../../smash.js");
const logger = smash.logger("Event");
const errorUtil = new smash.SmashError(logger);

class Event {
    constructor(rawEvent, context, terminate) {
        if (typeof rawEvent !== 'object') {
            throw new Error("First parameter of Event() must be an object, " + errorUtil.typeOf(rawEvent));
        }
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
        Object.assign(this, rawEvent);
        this._rawEvent = rawEvent;
        const splittedArn = rawEvent.Records[0].eventSourceARN.split(":");
        const topicInfos = splittedArn.pop().split("-");
        this.project = topicInfos.shift();
        this.queue = topicInfos.shift();
        this.env = topicInfos.shift();
        this.region = topicInfos.join("-");
        this.context = context;
        try {
            this.message = JSON.parse(rawEvent.Records[0].body);
        } catch (error) {
            const messages = rawEvent.Records[0].body.split("\n");
            this.message = {};
            for (let i = 0, length = messages.length; i < length; i++) {
                if (messages[i]) {
                    const content = messages[i].split("=");
                    if (content.length === 1 || (content.length === 2 && !content[1])) {
                        throw new Error("Unsupported message type: " + rawEvent.Records[0].body);
                    } else if (content.length > 1) {
                        const key = content.shift();
                        let value = content.join("=")
                        if (value.charAt(0) === "'") {
                            value = value.substr(1);
                        }
                        if (value.charAt(value.length - 1) === "'") {
                            value = value.slice(0, -1);
                        }
                        try {
                            this.message[key] = JSON.parse(value);
                        } catch (error) {
                            this.message[key] = value;
                        }
                    }
                }
            }
        }
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
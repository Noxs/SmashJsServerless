const smash = require("../../../../smash.js");

class Event extends smash.Console {
    constructor(rawEvent, context, terminate) {
        super();
        if (typeof rawEvent !== 'object') {
            throw new Error("First parameter of Event() must be an object, " + this.typeOf(rawEvent));
        }
        this._rawEvent = rawEvent;
        Object.assign(this, rawEvent);
        const splittedArn = rawEvent.Records[0].EventSubscriptionArn.split(":");
        splittedArn.pop();
        const topicInfos = splittedArn.pop().split("-");
        this.project = topicInfos.shift();
        this.channel = topicInfos.shift();
        this.env = topicInfos.shift();
        this.region = topicInfos.join("-");
        this.context = context;
        this.type = rawEvent.Records[0].Sns.Type;
        this.subject = rawEvent.Records[0].Sns.Subject;
        try {
            this.message = JSON.parse(rawEvent.Records[0].Sns.Message);
        } catch (error) {
            const messages = rawEvent.Records[0].Sns.Message.split("\n");
            this.message = {};
            for (let i = 0, length = messages.length; i < length; i++) {
                const content = messages[i].split("=");
                if (content.length === 1) {
                    this.message = content;
                } else if (content.length === 2) {
                    try {
                        this.message[content[0]] = JSON.parse(content[1]);
                    } catch (error) {
                        this.message[content[0]] = content[1];
                    }
                } else if (content.length > 2) {
                    throw new Error("Unsupported message type: " + rawEvent.Records[0].Sns.Message);
                }
            }
        }
        if (typeof terminate !== 'object') {
            throw new Error("Third parameter of Event() must be a object, " + this.typeOf(terminate));
        }
        if (typeof terminate.terminate !== 'function') {
            throw new Error("Third parameter of Event() must be an object with a function called terminate, " + this.typeOf(terminate.terminate));
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
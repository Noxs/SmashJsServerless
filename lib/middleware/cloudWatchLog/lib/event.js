const smash = require("../../../../smash.js");
const zlib = require('zlib');

class Event extends smash.Console {
    constructor(rawEvent, context, terminate) {
        super();
        this.context = context;
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
        if (typeof rawEvent !== 'object') {
            throw new Error("First parameter of Event() must be an object, " + this.typeOf(rawEvent));
        }
        try {
            this._transformedEvent = JSON.parse(zlib.gunzipSync(new Buffer(rawEvent.awslogs.data, 'base64')).toString('ascii'));
            Object.assign(this, this._transformedEvent);
            this._rawEvent = rawEvent;
        } catch (error) {
            this.error("Failed uncompress event", error);
            this.failure(this.buildError("Failed uncompress event", this.codes.internalServerError));
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
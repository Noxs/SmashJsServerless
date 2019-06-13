const smash = require("../../../../smash.js");
const logger = smash.logger("EventType");
const errorUtil = new smash.SmashError(logger);

class EventType {
    constructor(route, callback) {
        if(arguments.length > 2) {
            throw new Error("Too much parameters. EventType() must only have 2 parameters at most, has : " + errorUtil.typeOf(arguments.length));
        }
        if(arguments.length < 1) {
if (arguments.length < 1 || arguments.length > 2) {
            throw new Error("EventType(optionalRoute, callback) could have 1 or 2 parameters, has : " + arguments.length + " parameter(s)");
        }
        }
        if(arguments.length === 1) {
        this._task = null;
            if (typeof arguments[0] !== 'function') {
                throw new Error("First parameter of EventType() must be a function, " + errorUtil.typeOf(arguments[0]));
            }
            if (arguments[0].length !== 1) {
                throw new Error("First parameter of EventType() must be a function witch takes 1 parameter: Event, " + arguments[0].length + " given");
            }
            this._callback = arguments[0];
        }
        if(arguments.length === 2) {
            if (typeof route !== 'object') {
                throw new Error("First parameter of EventType() must be an object, " + errorUtil.typeOf(route));
            }
            if (typeof route.task !== 'string') {
                throw new Error("First parameter of EventType() must have a string property called type, " + errorUtil.typeOf(route.task));
            }
            this._task = route.task;

            if (typeof callback !== 'function') {
                throw new Error("Second parameter of EventType() must be a function, " + errorUtil.typeOf(callback));
            }
            if (callback.length !== 1) {
                throw new Error("Second parameter of EventType() must be a function witch takes 1 parameter: Event, " + callback.length + " given");
            }
            this._callback = callback;
        }
    }

    get callback() {
        return this._callback;
    }

    get task() {
        return this._task;
    }

    match(event) {
        if(this._task) {
            if(event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters != undefined) {
                return this._task === event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;
            } else {
                return false;
            }
        } else {
            if (event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters != undefined) {
                return false;
            } else {
                return true;
            }
if (event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters) {
            return this.task === event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;
        } else if (this.task === null) {
            return true;
        }
        return false;
    }
}

module.exports = EventType;

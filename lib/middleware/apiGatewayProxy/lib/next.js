const smash = require("../../../../smash.js");
const logger = smash.logger("Next");
const errorUtil = new smash.SmashError(logger);
const Request = require("./request.js");
const Response = require("./response.js");

class Next {
    constructor() {
        if (this.constructor === Next) {
            throw new Error("Next is an abstract class, you must extend it from another class like class Foobar extends Next {}");
        }
        this._next = null;
    }

    setNext(next) {
        if (typeof next !== 'object') {
            throw new Error("First parameter of setNext() must be a oject, " + errorUtil.typeOf(next));
        }
        if (typeof next.handleRequest !== 'function') {
            throw new Error("First parameter of setNext() must be a oject with a function called handleRequest, " + errorUtil.typeOf(next.handleRequest));
        }
        if (next.handleRequest.length !== 2) {
            throw new Error("First parameter of setNext() must be a function witch takes 2 parameters, " + next.handleRequest.length + " given");
        }
        this._next = next;
        return this;
    }

    next(request, response) {
        if (this._next === null) {
            response.handleError(errorUtil.internalServerError("Property next has not been set"));
            return;
        }
        if (!request || request.constructor !== Request) {
            response.handleError(errorUtil.internalServerError("First parameter of next() must be Request object type, " + errorUtil.typeOf(request)));
            return;
        }
        if (!response || response.constructor !== Response) {
            response.handleError(errorUtil.internalServerError("Second parameter of next() must be Response object type, " + errorUtil.typeOf(response)));
            return;
        }
        this._next.handleRequest(request, response);
        return this;
    }

}

module.exports = Next;

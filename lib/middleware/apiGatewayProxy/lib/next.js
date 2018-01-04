const smash = require("../../../../smash.js");
const Request = require("./request.js");
const Response = require("./response.js");

class Next extends smash.Console {
    constructor() {
        super();
        if (this.constructor === Next) {
            throw new Error("Next is an abstract class, you must extend it from another class like class Foobar extends Next {}");
        }
        this._next = null;
    }

    setNext(next) {
        if (typeof next !== 'object') {
            throw new Error("First parameter of setNext() must be a oject, " + this.typeOf(next));
        }
        if (typeof next.handleRequest !== 'function') {
            throw new Error("First parameter of setNext() must be a oject with a function called handleRequest, " + this.typeOf(next.handleRequest));
        }
        if (next.handleRequest.length !== 2) {
            throw new Error("First parameter of setNext() must be a function witch takes 2 parameters, " + next.handleRequest.length + " given");
        }
        this._next = next;
        return this;
    }

    next(request, response) {
        if (this._next === null) {
            this.error("Property next has not been set");
            response.internalServerError("Internal server error");
            return;
        }
        if (!request || request.constructor !== Request) {
            this.error("First parameter of next() must be Request object type, " + this.typeOf(request));
            response.internalServerError("Internal server error");
            return;
        }
        if (!response || response.constructor !== Response) {
            this.error("Second parameter of next() must be Response object type, " + this.typeOf(response));
            response.internalServerError("Internal server error");
            return;
        }
        this._next.handleRequest(request, response);
        return this;
    }

}

module.exports = Next;
const Console = require("../util/console.js");
const Request = require("./request.js");
const Response = require("./response.js");

class Next extends Console {
    constructor() {
        super();
        if (this.constructor === Next) {
            throw new Error("Next is an abstract class, you must extend it from another class like class Foobar extends Next {}");
        }
        this._next = null;
    }

    setNext(next) {
        if (typeof next !== 'function') {
            throw new Error("First parameter of setNext() must be a function, " + typeof next + " given");
        }
        if (next.length !== 2) {
            throw new Error("First parameter of setNext() must be a function witch takes 2 parameters, " + next.length + " given");
        }
        this._next = next;
        return this;
    }

    next(request, response) {
        if (this._next === null) {
            throw new Error("Property next has not been set");
        }
        if (!request || request.constructor !== Request) {
            throw new Error("First parameter of next() must be Request object type, " + typeof request + (request ? " " + request.constructor : "") + " given");
        }
        if (!response || response.constructor !== Response) {
            throw new Error("Second parameter of next() must be Response object type, " + typeof response + (response ? " " + response.constructor : "") + " given");
        }
        this._next(request, response);
        return this;
    }

}

module.exports = Next;
const smash = require("../../../../smash.js");

class RouteParameter extends smash.Console {
    constructor(keyword, position) {
        super();
        if (typeof keyword !== 'string') {
            throw new Error("First parameter of RouteParameter() must be a string, " + this.typeof(keyword) + " given");
        }
        this._keyword = keyword;
        if (typeof position !== 'number' || Number.isInteger(position) !== true) {
            throw new Error("Second parameter of RouteParameter() must be an integer, " + this.typeof(position) + " given");
        }
        this._position = position;
    }

    get keyword() {
        return this._keyword;
    }

    get position() {
        return this._position;
    }
}

module.exports = RouteParameter;
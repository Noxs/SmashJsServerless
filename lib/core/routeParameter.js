class RouteParameter {
    constructor(keyword, position) {
        if (typeof keyword !== 'string') {
            throw new Error("First parameter of RouteParameter() must be a string, " + typeof keyword + " given");
        }
        this._keyword = keyword;
        if (typeof position !== 'number' || Number.isInteger(position) !== true) {
            throw new Error("Second parameter of RouteParameter() must be an integer, " + typeof position + " given");
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
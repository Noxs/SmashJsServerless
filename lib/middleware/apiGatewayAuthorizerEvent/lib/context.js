const smash = require("../../../../smash.js");
const logger = smash.logger("Context");
const errorUtil = new smash.SmashError(logger);
const SEPARATOR = ":";

class Context {
    constructor(rawObject) {
        this._rawObject = rawObject;
        if (Array.isArray(this._rawObject.roles) === false) {
            this._rawObject.roles = [this._rawObject.roles];
        }
    }

    get roles() {
        return this._rawObject._roles;
    }

    get principalId() {
        return this._rawObject.id + SEPARATOR + this._rawObject.username;
    }

    rawObject() {
        for (const key in this._rawObject) {
            if (typeof this._rawObject[key] !== "string" && typeof this._rawObject[key] !== "number") {
                this._rawObject[key] = JSON.stringify(this._rawObject[key]);
            }
        }
        const rawObject = {
            ...this._rawObject,
            principalId: this.principalId,
        };
        return rawObject;
    }
}

module.exports = Context;

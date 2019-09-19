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

    get rawObject() {
        return this._rawObject;
    }

    get roles() {
        return this.rawObject._roles;
    }

    get principalId() {
        return this.rawObject.id + SEPARATOR + this.rawObject.username;
    }

    rawObject() {
        const rawObject = {
            ...this.rawObject,
            principalId: this.principalId,
        };
        for (const key in this.rawObject) {
            if (typeof this.rawObject[key] !== "string" && typeof this.rawObject[key] !== "number") {
                this.rawObject[key] = JSON.stringify(this.rawObject[key]);
            }
        }
        return rawObject;
    }
}

module.exports = Context;

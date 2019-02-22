const smash = require("../../../../smash.js");
const SEPARATOR = ":";
const COMMA = ",";

class Context extends smash.Console {
    constructor(id, username, region, roles, resources = []) {
        super();
        if (typeof id !== 'string') {
            throw new Error("First parameter of Context(id, username, region, roles, resources = []) must be an string, " + this.typeOf(id));
        }
        this._id = id;
        if (typeof username !== 'string') {
            throw new Error("Second parameter of Context(id, username, region, roles, resources = []) must be an string, " + this.typeOf(username));
        }
        this._username = username;
        if (typeof region !== 'string') {
            throw new Error("Third parameter of Context(id, username, region, roles, resources = []) must be an string, " + this.typeOf(region));
        }
        this._region = region;
        if (Array.isArray(roles) === false && typeof roles !== 'string') {
            throw new Error("Fourth parameter of Context(id, username, region, roles, resources = []) must be an string or an array, " + this.typeOf(roles));
        }
        if (Array.isArray(roles) === true) {
            this._roles = roles;
        } else {
            this._roles = [roles];
        }
        if (Array.isArray(resources) === true) {
            this._resources = resources;
        } else {
            this._resources = [resources];
        }
    }

    get id() {
        return this._id;
    }

    get username() {
        return this._username;
    }

    get region() {
        return this._region;
    }

    get roles() {
        return this._roles;
    }

    get principalId() {
        return this._id + SEPARATOR + this._username;
    }

    addResource(resource) {
        this._resources.push(resource);
        return this;
    }

    get resources() {
        return this._resources;
    }

    rawObject() {
        return {
            id: this.id,
            username: this.username,
            region: this.region,
            roles: this.roles.join(COMMA),
            resources: this.resources.join(COMMA),
            principalId: this.principalId,
        };
    }

}

module.exports = Context;
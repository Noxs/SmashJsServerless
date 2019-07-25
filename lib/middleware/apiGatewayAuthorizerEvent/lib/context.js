const smash = require("../../../../smash.js");
const logger = smash.logger("Context");
const errorUtil = new smash.SmashError(logger);
const SEPARATOR = ":";
const COMMA = ",";

class Context {
    constructor({ id, username, group, organisation, region, roles, requestedResource }) {
        this.id = id;
        this.username = username;
        this.group = group;
        this.organisation = organisation;
        this.username = username;
        this.region = region;
        if (Array.isArray(roles) === true) {
            this._roles = roles;
        } else {
            this._roles = [roles];
        }
        if (Array.isArray(requestedResource) === true) {
            this._resources = requestedResource;
        } else {
            this._resources = [requestedResource];
        }
    }

    get roles() {
        return this._roles;
    }

    get principalId() {
        return this._id + SEPARATOR + this._username;
    }

    get resources() {
        return this._resources;
    }

    rawObject() {
        return {
            id: this.id,
            username: this.username,
            group: this.group,
            organisation: this.organisation,
            region: this.region,
            roles: this.roles.join(COMMA),
            resources: this.resources.join(COMMA),
            principalId: this.principalId,
        };
    }
}

module.exports = Context;

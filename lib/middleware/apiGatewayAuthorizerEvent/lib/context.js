const smash = require("../../../../smash.js");
const logger = smash.logger("Context");
const errorUtil = new smash.SmashError(logger);
const SEPARATOR = ":";
const COMMA = ",";

class Context {
    constructor({ id, username, group, organization, region, roles, requestedResource }) {
        this.id = id;
        this.username = username;
        this.group = group;
        this.organization = organization;
        this.username = username;
        this.region = region;
        if (Array.isArray(roles) === true) {
            this._roles = roles;
        } else {
            this._roles = [roles];
        }
        this.requestedResource = requestedResource;
    }

    get roles() {
        return this._roles;
    }

    get principalId() {
        return this.id + SEPARATOR + this.username;
    }

    rawObject() {
        return {
            id: this.id,
            username: this.username,
            group: this.group,
            organization: this.organization,
            region: this.region,
            roles: this.roles.join(COMMA),
            resource: this.resource,
            principalId: this.principalId,
        };
    }
}

module.exports = Context;

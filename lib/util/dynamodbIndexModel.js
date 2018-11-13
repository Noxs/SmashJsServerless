const Console = require('./console.js');
const smash = require("../../smash.js");
const DYNAMODB_TABLE_SUFFIX = "dynamodb.tableSuffix";
const UNDERSCORE = "_";

class DynamodbIndexModel extends Console {
    constructor(table) {
        super();
        if (this.constructor === DynamodbIndexModel) {
            throw new Error("DynamodbIndexModel is an abstract class, you must extend it from another class like class Foobar extends DynamodbIndexModel {}");
        }
        this._table = table;
    }

    get table() {
        const env = smash.getEnv("ENV");
        const tables = smash.config.get(DYNAMODB_TABLE_SUFFIX);
        if (env && tables && tables[env]) {
            return this._table + tables[env];
        } else if (env) {
            return this._table + UNDERSCORE + env;
        } else {
            return this._table;
        }
    }

}

module.exports = DynamodbIndexModel;


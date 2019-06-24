const smash = require("../../smash.js");
const Console = require("./console.js");
const logger = require('./smashLogger');
const DYNAMODB_TABLE_SUFFIX = "dynamodb.tableSuffix";
const UNDERSCORE = "_";

class DynamodbModel extends Console {// FIX ME remove extends console in next major, only for compatibility
    constructor(table, env = null) {
        super();
        if (this.constructor === DynamodbModel) {
            throw new Error("DynamodbModel is an abstract class, you must extend it from another class like class Foobar extends DynamodbModel {}");
        }
        if (typeof table !== 'string' || table.length === 0) {
            throw new Error("First parameter of constructor(table) must be a string, " + logger.typeOf(table));
        }
        this._table = table;
        this._env = env;
        this.namespace("Table " + this.table);
    }

    set env(env) {
        this._env = env;
        return this;
    }

    get env() {
        if (!this._env) {
            this._env = smash.getEnv("ENV");
            if (!this._env) {
                logger.info("Missing ENV variable in environment");
            }
        }
        return this._env;
    }

    get table() {
        const env = this.env;
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

module.exports = DynamodbModel;


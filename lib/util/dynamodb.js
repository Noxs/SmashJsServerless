const _ = require("lodash");
const smash = require("../../smash.js");
const aws = require('aws-sdk');
const dynamodbDataTypes = require('dynamodb-data-types').AttributeValue;
const DYNAMODB_TABLE_SUFFIX = "dynamodb.tableSuffix";
const UNDERSCORE = "_";

class Dynamodb {
    constructor(parameters, env = null) {
        if (this.constructor === Dynamodb) {
            // REWORK to smashError ??
            throw new Error("Dynamodb is an abstract class, you must extend it from another class like class Foobar extends Dynamodb {}");
        }
        if (typeof table !== 'string' || table.length === 0) {
            // REWORK to smashError ??
            throw new Error("First parameter of constructor(table) must be a string, " + logger.typeOf(table));
        }
        this._table = table;
        this._env = env;
        this.logger = smash.logger("Dynamodb " + this.table); // FIX ME table or name
        this.errorUtil = new smash.SmashError(logger);
        this.wrapper = dynamodbDataTypes;
        Object.assign(this, new aws.DynamoDB()); //GOOD idea??
        this._buildDatabase();
    }

    setWrapper(wrapper) {
        this.wrapper = wrapper;
        return this;
    }

    wrap(item) {
        if (Array.isArray(item) === true) {
            return item.map(iterator => this.wrapper.wrap(iterator));
        } else {
            return this.wrapper.wrap(item);
        }
    }

    unwrap(item) {
        if (Array.isArray(item) === true) {
            return item.map(iterator => this.wrapper.unwrap(iterator));
        } else {
            return this.wrapper.unwrap(item);
        }
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

    _buildDatabase() {

    }

    _get() {

    }

    _gets() {

    }

    _post() {

    }

    _put() {

    }

    _delete() {

    }

    _getByIndex() {

    }

    _getsByIndex() {

    }

    _postByIndex() {

    }

    _putByIndex() {

    }

    _deleteByIndex() {

    }

    /* order asc, desc in optional parameters => ScanIndexForward */
    /* last key in optional parameters => ExclusiveStartKey */
    /* limit in optional parameters => Limit */


    /*  
    return :
    Items
    Count
    ScannedCount
    LastEvaluatedKey
    ConsumedCapacity
    */

}

module.exports = Dynamodb;


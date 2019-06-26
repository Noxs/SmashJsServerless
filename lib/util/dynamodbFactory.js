const aws = require('aws-sdk');
const Dynamodb = require('./dynamodb');
const DynamodbConfigBuilder = require("../../helper/dynamodbConfigBuilder");
const Logger = require('./smashLogger');
const logger = new Logger('DynamodbFactory');

class DynamodbFactory {
    constructor(prefix, suffix, options={}) {
        this._tableNames = [];
        this._dynamodbs = [];
        if (typeof prefix !== 'string') {
            throw new Error("First parameter of DynamodbFactory(prefix, suffix, options) must be a string, " + logger.typeOf(prefix));
        }
        this._tablePrefix = prefix;
        if (typeof suffix !== 'string') {
            throw new Error("Second parameter of DynamodbFactory(prefix, suffix, options) must be a string, " + logger.typeOf(suffix));
        }
        this._tableSuffix = suffix;
        if (typeof options !== 'object') {
            throw new Error("Third parameter of DynamodbFactory(prefix, suffix, options) must be an object, " + logger.typeOf(options));
        }
        this._client = new aws.DynamoDB(options);
    }

    get dynamodbs() {
        return this._dynamodbs;
    }

    get(name) { //TO TEST
        const dynamodbFound = this._dynamodbs.find(dynamodb => dynamodb.table === name);
        if (dynamodbFound === undefined) {
            throw new Error("Table not found : " + name);
        }
        return this._dynamodbs.find(dynamodb => dynamodb.table === name);
    }

    _matchTable(tableName) {
        const tableRegexp = "^" + this._tablePrefix + "_.*_" + this._tableSuffix + "$";
        const regexp = new RegExp(tableRegexp);
        return regexp.test(tableName);
    }

    _getListTables() {
        return new Promise((resolve, reject) => {
            this._client.listTables({}, (error, data) => {
                if (error) {
                    reject(new Error("Cannot retrieve table list for this config, ", error));
                } else {
                    const that = this;
                    const result = data['TableNames'].map(tableName => {if(that._matchTable(tableName)) {return tableName}});
                    resolve(result);
                };
            });
        });
    }

    _getConfigTable(tableName) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: tableName
            };
            this._client.describeTable(params, function (error, data) {
                if (error) {
                    reject(new Error("Cannot retrieve configuration for table " + tableName, error));
                } else {
                    const result = data['Table'];
                    resolve(result);
                };
            });
        });
    }

    _buildDynamodb(config) {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder(this._tablePrefix, this._tableSuffix, config);
        dynamodbConfigBuilder._translateDescription();
        const dynamodb = new Dynamodb(dynamodbConfigBuilder.transformedDescription);
        return dynamodb;
    }

    async buildConfigTables() {
        const promises = [];
        try {
            this._tableNames = await this._getListTables();
        } catch (error) {
            throw new Error("Can't retrieve list of table, ", error);
        }
        this._tableNames.forEach(tableName => {
            promises.push(this._getConfigTable(tableName));
        });
        try {
            const configs = await Promise.all(promises);
            configs.forEach(config => {
                this._dynamodbs.push(this._buildDynamodb(config));
            });
        } catch (error) {
            throw new Error("Can't retrieve list of configs, ", error);
        }
    }

}

module.exports = DynamodbFactory;

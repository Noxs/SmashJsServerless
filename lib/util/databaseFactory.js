const Dynamodb = require('./dynamodb');
const aws = require('aws-sdk');
const DatabaseConfigBuilder = require("../../helper/databaseConfigBuilder");

class DatabaseFactory { // Rename to DynamodbFactory
    constructor(prefix, suffix, options) {
        this._tableNames = [];
        this._dynamodbs = [];
        this._tablePrefix = prefix;
        this._tableSuffix = suffix;
        this._client = new aws.DynamoDB(options);
    }

    _matchTable(tableName) { //tester
        const tableRegexp = "^" + this._tablePrefix + "_.*_" + this._tableSuffix + "$";
        const regexp = new RegExp(tableRegexp);
        return regexp.test(tableName);
    }

    _getListTables() {
        return new Promise((resolve, reject) => {

            this._client.listTables({}, function (error, data) {
                if (error) {
                    reject(new Error("Cannot retrieve table list for this config, ", error));
                } else {
                    const result = data['TableNames'].map(tableName => this._matchTable(tableName));
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
        const databaseConfigBuilder = new DatabaseConfigBuilder(config);
        databaseConfigBuilder._translateDescription();
        const dynamodb = new Dynamodb(databaseConfigBuilder._transformedDescription);
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

module.exports = DatabaseFactory;

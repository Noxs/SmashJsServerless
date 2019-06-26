const smash = require("../../smash.js");
const aws = require('aws-sdk');
const logger = require('./smashLogger');
const SmashError = require("./smashError");
const dynamodbDataTypes = require('dynamodb-data-types').AttributeValue;
const UNDERSCORE = "_";

class Dynamodb {
    constructor(configuration) {
        this.logger = new logger("Dynamodb");
        this.errorUtil = new SmashError(logger);
        if (typeof configuration !== 'object') {
            throw new Error("First parameter of Dynamodb(configuration) must be an object, " + this.logger.typeOf(configuration));
        }
        this.table = this._sanityCheck(configuration.table, "table", "string", "configuration");
        this.name = this._sanityCheck(configuration.name, "name", "string", "configuration");
        this.primaryIndex = this._sanityCheck(configuration.primaryIndex, "primaryIndex", "object", "configuration");
        this._sanityCheck(configuration.primaryIndex.partitionKey, "partitionKey", "string", "configuration.primaryIndex");
        if (configuration.primaryIndex.sortKey) {
            this._sanityCheck(configuration.primaryIndex.sortKey, "sortKey", "string", "configuration.primaryIndex");
        }

        this.secondaryIndex = this._sanityCheck(configuration.secondaryIndex, "secondaryIndex", "array", "configuration");
        if (this.secondaryIndex.length !== 0) {
            this.secondaryIndex.forEach(index => {
                this._sanityCheck(index.partitionKey, "partitionKey", "string", "configuration.secondaryIndex[]");
                if (index.sortKey) {
                    this._sanityCheck(index.sortKey, "sortKey", "string", "configuration.secondaryIndex[]");
                }
            });
        }

        this.wrapper = dynamodbDataTypes;
        this.client = new aws.DynamoDB.DocumentClient();
        this._buildMetaDatabase();
    }

    _toCamelCase(name) {
        if (name.includes('_')) {
            let parsedName = name.split("_");
            let camelCasedName = "";
            for (let i = 0; i < parsedName.length; i++) {
                camelCasedName += parsedName[i].charAt(0).toUpperCase() + parsedName[i].slice(1);
            }
            return camelCasedName;
        } else {
            return name;
        }
    }

    _sanityCheck(property, name, type, object, optional) {
        if (type === "array" && Array.isArray(property) === false) {
            throw new Error("Invalid parameter " + name + " in " + object + ", " + type + " required " + this.logger.typeOf(property));
        } else if (type !== "array" && typeof property !== type) {
            throw new Error("Invalid parameter " + name + " in " + object + ", " + type + " required " + this.logger.typeOf(property));
        }
        return property;
    }

    setWrapper(wrapper) {
        this.wrapper = wrapper;
        return this;
    }

    wrap(item) {
        if (Array.isArray(item) === true) {
            return item.map(iterator => this.wrapper.wrap(iterator));
        }
        return this.wrapper.wrap(item);
    }

    unwrap(item) {
        if (Array.isArray(item) === true) {
            return item.map(iterator => this.wrapper.unwrap(iterator));
        } else {
            return this.wrapper.unwrap(item);
        }
    }

    setClient(client) {
        this.client = client;
        return this;
    }

    get table() {
        return this.table;
    }

    buildArgsForSingle(args) {
        // partitionKey, options
        if (args.length !== 0) {
            if (args.length === 1) {
                if (typeof args[0] === "object") {
                    return [null, args[0]];
                } else if (typeof args[0] === "string") {
                    return [args[0], {}];
                } else {
                    throw new Error("Invalid function parameters");
                }
            } else if (args.length === 2 && typeof args[0] === "string" && typeof args[1] === "object") {
                return args;
            } else {
                throw new Error("Invalid function parameters");
            }
        } else {
            return [null, {}];
        }
    }

    buildArgsForDual(args) {
        // partitionKey, sortKey, options
        if (args.length !== 0) {
            if (args.length === 1) {
                if (typeof args[0] === "object") {
                    return [null, null, args[0]];
                } else if (typeof args[0] === "string") {
                    return [args[0], null, {}];
                } else {
                    throw new Error("Invalid function parameters");
                }
            } else if (args.length === 2) {
                if (typeof args[0] === "string" && typeof args[1] === "object") {
                    return [args[0], null, args[1]];
                } else if (typeof args[0] === "string" && typeof args[1] === "string") {
                    return [args[0], args[1], {}];
                } else {
                    throw new Error("Invalid function parameters");
                }
            } else if (args.length === 3 && typeof args[0] === "string" && typeof args[1] === "string" && typeof args[2] === "object") {
                return args;
            } else {
                throw new Error("Invalid function parameters");
            }
        } else {
            return [null, null, {}];
        }
    }

    buildPrimaryIndexMethod() {
        if (this.primaryIndex.sortKey) {
            this["get" + this.name] = function (...args) {
                return this._getDual(...this.buildArgsForDual(args));
            };
            this["find" + this.name] = function (...args) {
                return this._findDual(...this.buildArgsForDual(args));
            };
            this["delete" + this.name] = function (...args) {
                return this._deleteDual(...this.buildArgsForDual(args));
            };
            this["post" + this.name] = function (...args) {
                return this._postDual(...this.buildArgsForDual(args));
            };
            this["put" + this.name] = function (...args) {
                return this._putDual(...this.buildArgsForDual(args));
            };
            this["get" + this.name + "s"] = function (...args) {
                return this._getsDual(...this.buildArgsForDual(args));
            };
        } else {
            this["get" + this.name] = function (...args) {
                return this._getSingle(...this.buildArgsForSingle(args));
            };
            this["find" + this.name] = function (...args) {
                return this._findSingle(...this.buildArgsForSingle(args));
            };
            this["delete" + this.name] = function (...args) {
                return this._deleteSingle(...this.buildArgsForSingle(args));
            };
            this["post" + this.name] = function (...args) {
                return this._postSingle(...this.buildArgsForSingle(args));
            };
            this["put" + this.name] = function (...args) {
                return this._putSingle(...this.buildArgsForSingle(args));
            };
            this["get" + this.name + "s"] = function (...args) {
                return this._getsSingle(...this.buildArgsForSingle(args));
            };
        }
    }

    buildSecondaryIndexMethod() {
        if (this.secondaryIndex && this.secondaryIndex.length !== 0) {
            this.secondaryIndex.forEach(index => {
                const camelCaseIndexName = this._toCamelCase(index.indexName);
                if (index.sortKey) {
                    this["get" + this.name + "By" + camelCaseIndexName] = function (...args) {
                        const _index = index;
                        return this._getByIndexDual(_index, ...this.buildArgsForDual(args));
                    };
                    this["find" + this.name + "By" + camelCaseIndexName] = function (...args) {
                        const _index = index;
                        return this._findByIndexDual(_index, ...this.buildArgsForDual(args));
                    };
                    this["get" + this.name + 's' + "By" + camelCaseIndexName] = function (...args) {
                        const _index = index;
                        return this._getsByIndexDual(_index, ...this.buildArgsForDual(args));
                    };
                } else {
                    this["get" + this.name + "By" + camelCaseIndexName] = function (...args) {
                        const _index = index;
                        return this._getByIndexSingle(_index, ...this.buildArgsForSingle(args));
                    };
                    this["find" + this.name + "By" + camelCaseIndexName] = function (...args) {
                        const _index = index;
                        return this._findByIndexSingle(_index, ...this.buildArgsForSingle(args));
                    };
                    this["get" + this.name + 's' + "By" + camelCaseIndexName] = function (...args) {
                        const _index = index;
                        return this._getsByIndexSingle(_index, ...this.buildArgsForSingle(args));
                    };
                }
            });
        }
    }

    _buildMetaDatabase() {
        this.buildPrimaryIndexMethod();
        this.buildSecondaryIndexMethod();
    }

    _transformResults(result) {
        const convertedResult = {};
        if (result.Items) {
            convertedResult.items = result.Items.map(item => this.unwrap(item));
        }
        if (!isNaN(result.Count)) {
            convertedResult.count = result.Count;
        }
        if (!isNaN(result.ScannedCount)) {
            convertedResult.scannedCount = result.ScannedCount;
        }
        if (result.LastEvaluatedKey) {
            convertedResult.lastEvaluatedKey = result.LastEvaluatedKey;
        }
        if (!isNaN(result.ConsumedCapacity)) {
            convertedResult.consumedCapacity = result.ConsumedCapacity;
        }
        return convertedResult;
    }

    _addResults(result, convertedResult) {
        if (convertedResult.items) {
            if (convertedResult.items.length !== 0) {
                result.items = result.items.concat(convertedResult.items);
            }
        }
        if (convertedResult.count) {
            result.count += convertedResult.count;
        }
        if (convertedResult.scannedCount) {
            result.scannedCount += convertedResult.scannedCount;
        }
        if (convertedResult.lastEvaluatedKey) {
            result.lastEvaluatedKey = convertedResult.lastEvaluatedKey;
        }
        if (convertedResult.consumedCapacity) {
            result.consumedCapacity += convertedResult.consumedCapacity;
        }
        return result;
    }

    _addOptions(parameters, options) {
        // TODO sanity check options???
        if (options.scanIndexForward) {
            parameters.ScanIndexForward = options.scanIndexForward;
        }
        if (options.exclusiveStartKey) {
            parameters.ExclusiveStartKey = options.exclusiveStartKey;
        }
        if (options.limit) {
            parameters.Limit = options.limit;
        }
        return parameters;
    }

    _buildObjectToDelete(data, { partitionKey, sortKey }) {
        const indexes = {};
        if (typeof data.partitionKey === "object") {
            indexes[partitionKey] = data.partitionKey[partitionKey];
            if (sortKey) {
                indexes[sortKey] = data.partitionKey[sortKey];
            }
        } else {
            indexes[partitionKey] = data.partitionKey;
            if (sortKey) {
                indexes[sortKey] = data.sortKey;
            }
        }
        return indexes;
    }

    _getSingle(partitionKey, options) {
        if (partitionKey !== null) {
            return new Promise((resolve, reject) => {
                this._findSingle(partitionKey, options).then(result => {
                    if (result.items === null) {
                        reject(this.errorUtil.notFoundError({ name: this.name, primary: partitionKey }));
                    } else {
                        resolve(result);
                    }
                }).catch(reject);
            });
        } else {
            throw new Error("Invalid parameters for function _getByIndexSingle");
        }
    }

    _findSingle(partitionKey, options) {
        //TODO add support for batch find, if item is an array => use _findSingleBatch
        return new Promise((resolve, reject) => {
            const params = this._addOptions({
                TableName: this.table,
                KeyConditionExpression: "#partitionKey = :partitionKey",
                ExpressionAttributeValues: {
                    ':partitionKey': partitionKey,
                },
                ExpressionAttributeNames: {
                    "#partitionKey": this.primaryIndex.partitionKey,
                },
            }, options);
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            this.client.query(params, (error, result) => {
                if (error) {
                    reject(this.errorUtil.internalServerError("Query failed on " + params.TableName, error));
                } else {
                    result = this._transformResults(result);
                    if (result.items.length === 0) {
                        result.items = null;
                    }
                    resolve(result);
                }
            });
        });
    }

    _getsSingle(options) {
        return new Promise((resolve, reject) => {
            const result = {
                items: [],
                consumedCapacity: 0,
                lastEvaluatedKey: null,
                scannedCount: 0,
                count: 0,
            };
            const params = this._addOptions({
                TableName: this.table,
            }, options);
            const loadDataRecursive = params => {
                this.client.scan(params, (error, data) => {
                    if (error) {
                        reject(this.errorUtil.internalServerError("Scan failed on " + params.TableName, error));
                    } else {
                        this._addResults(result, this._transformResults(data));
                        if (result.lastEvaluatedKey) {
                            params.ExclusiveStartKey = result.lastEvaluatedKey;
                            loadDataRecursive(params);
                        } else {
                            resolve(result);
                        }
                    }
                });
            };
            loadDataRecursive(params);
        });
    }

    _postSingle(item, options) {
        //TODO add support for batch post, if item is an array => use _postSingleBatch
        return new Promise((resolve, reject) => {
            item.created = new Date().toISOString();
            const params = this._addOptions({
                TableName: this.table,
                Item: this.wrap(item),
                ConditionExpression: 'attribute_not_exists(#partitionKey)',
                ExpressionAttributeNames: {
                    "#partitionKey": this.primaryIndex.partitionKey,
                },
            }, options);
            this.client.putItem(params, (error, data) => {
                if (error && error.name === "ConditionalCheckFailedException") {
                    reject(errorUtil.conflictError({ name: this.name, primary: item[this.primaryIndex.partitionKey] }));
                } else if (error) {
                    error.itemToPushed = item;
                    reject(errorUtil.internalServerError("Failed to put uniq item in " + params.TableName, error));
                } else {
                    resolve(this._transformResults(data));
                }
            });
        });
    }

    // TO DO
    // _postSingleBatch(item, options) {
    // }

    _putSingle(item, options) {
        //TODO add support for batch put, if item is an array => use _putSingleBatch
        return new Promise((resolve, reject) => {
            if (item.created) {
                item.modified = new Date().toISOString();
            } else {
                item.created = new Date().toISOString();
            }
            const params = this._addOptions({
                TableName: this.table,
                Item: this.wrap(item),
            }, options);
            this.client.putItem(params, (error, data) => {
                if (error) {
                    error.itemToPushed = item;
                    reject(errorUtil.internalServerError("Failed to put item in " + params.TableName, error));
                } else {
                    resolve(this._transformResults(data));
                }
            });
        });
    }

    _deleteSingle(partitionKey, options) {
        //TODO add support for batch delete, if item is an array => use _deleteSingleBatch
        return new Promise((resolve, reject) => {
            const indexes = this._buildObjectToDelete({ partitionKey }, { partitionKey: partitionKey });
            const params = this._addOptions({
                TableName: this.table,
                Key: this.wrap(indexes),
            }, options);
            this.client.deleteItem(params, error => {
                if (error) {
                    error.itemToDelete = item;
                    reject(errorUtil.internalServerError("Failed to delete item in " + params.TableName, error));
                } else {
                    resolve(this._transformResults(data));
                }
            });
        });
    }

    _getByIndexSingle(index, partitionKey, options) {
        if (partitionKey !== null) {
            return new Promise((resolve, reject) => {
                this._findByIndexSingle(index, partitionKey, options).then(result => {
                    if (result.items === null) {
                        reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey }));
                    } else {
                        resolve(result);
                    }
                }).catch(reject);
            });
        } else {
            throw new Error("Invalid parameters for function _getByIndexSingle"); s
        }
    }

    _findByIndexSingle(index, partitionKey, options) {
        //TODO add support for batch find, if item is an array => use _findSingleBatch
        return new Promise((resolve, reject) => {
            const params = this._addOptions({
                TableName: this.table,
                IndexName: index.IndexName,
                KeyConditionExpression: "#indexKey = :indexKey",
                ExpressionAttributeValues: {
                    ':indexKey': partitionKey,
                },
                ExpressionAttributeNames: {
                    "#indexKey": index.AttributeName,
                },
            }, options);
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            this.client.query(params, (error, result) => {
                if (error) {
                    reject(this.errorUtil.internalServerError("Query failed on " + params.TableName, error));
                } else {
                    result = this._transformResults(result);
                    if (result.items.length === 0) {
                        result.items = null;
                    }
                    resolve(result);
                }
            });
        });
    }

    _queryByIndexSingle(index, partitionKey, options) {
        //TODO add support for batch find, if item is an array => use _findSingleBatch
        return new Promise((resolve, reject) => {
            const params = this._addOptions({
                TableName: this.table,
                IndexName: index.IndexName,
                KeyConditionExpression: "#indexKey = :indexKey",
                ExpressionAttributeValues: {
                    ':indexKey': partitionKey,
                },
                ExpressionAttributeNames: {
                    "#indexKey": index.AttributeName,
                },
            }, options);
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            this.client.query(params, (error, result) => {
                if (error) {
                    reject(this.errorUtil.internalServerError("Query failed on " + params.TableName, error));
                } else {
                    result = this._transformResults(result);
                    if (result.items.length === 0) {
                        result.items = null;
                    }
                    resolve(result);
                }
            });
        });
    }

    _scanByIndexSingle(index, options) {
        //TODO add support for batch find, if item is an array => use _findSingleBatch
        return new Promise((resolve, reject) => {
            const result = {
                items: [],
                consumedCapacity: 0,
                lastEvaluatedKey: null,
                scannedCount: 0,
                count: 0,
            };
            const params = this._addOptions({
                TableName: this.table,
                IndexName: index.IndexName,
            }, options);
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            const loadDataRecursive = params => {
                this.client.scan(params, (error, data) => {
                    if (error) {
                        reject(this.errorUtil.internalServerError("Scan failed on " + params.TableName, error));
                    } else {
                        this._addResults(result, this._transformResults(data));
                        if (result.lastEvaluatedKey) {
                            params.ExclusiveStartKey = result.lastEvaluatedKey;
                            loadDataRecursive(params);
                        } else {
                            resolve(result);
                        }
                    }
                });
            };
            loadDataRecursive(params);
        });
    }

    _getsByIndexSingle(index, partitionKey, options) {
        if (partitionKey !== null) {
            return new Promise((resolve, reject) => {
                this._queryByIndexSingle(index, partitionKey, options).then(result => {
                    if (result.items === null) {
                        reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey }));
                    } else {
                        resolve(result);
                    }
                }).catch(reject);
            });
        } else {
            return new Promise((resolve, reject) => {
                this._scanByIndexSingle(index, options).then(result => {
                    if (result.items === null) {
                        reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName }));
                    } else {
                        resolve(result);
                    }
                }).catch(reject);
            });
        }
    }

    _getDual(partitionKey, sortKey, options) {
        return new Promise((resolve, reject) => {
            this._findDual(partitionKey, sortKey, options).then(result => {
                if (result.items === null) {
                    reject(this.errorUtil.notFoundError({ name: this.name, primary: partitionKey, sort: sortKey }));
                } else {
                    resolve(result);
                }
            }).catch(reject);
        });
    }

    _findDual(partitionKey, sortKey, options) {
        return new Promise((resolve, reject) => {
            const results = [];
            const params = {
                TableName: this.table,
                KeyConditionExpression: "#partitionKey = :partitionKey AND #sortKey = :sortKey",
                ExpressionAttributeValues: {
                    ':partitionKey': partitionKey,
                    ':sortKey': sortKey
                },
                ExpressionAttributeNames: {
                    "#partitionKey": this.primaryIndex.partitionKey,
                    "#sortKey": this.primaryIndex.sortKey
                },
            };
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            const loadDataRecursive = params => {
                this.client.query(params, (error, data) => {
                    if (error) {
                        reject(errorUtil.internalServerError("Query failed on " + params.TableName, error));
                    } else {
                        for (let i = 0; i < data.Items.length; i++) {
                            data.Items[i] = this.unwrap(data.Items[i]);
                            results.push(data.Items[i]);
                        }
                        if (data.LastEvaluatedKey) {
                            params.ExclusiveStartKey = data.LastEvaluatedKey;
                            loadDataRecursive(params);
                        } else {
                            resolve(results);
                        }
                    }
                });
            };
            loadDataRecursive(params);
        });
    }

    _queryDual(partitionKey, sortKey, options) {
        if (partitionKey !== null) {
            return new Promise((resolve, reject) => {
                const params = this._addOptions({
                    TableName: this.table,
                    IndexName: index.IndexName,
                    KeyConditionExpression: "#partitionKey = :partitionKey && #sortKey = :sortKey",
                    ExpressionAttributeValues: {
                        ':partitionKey': partitionKey,
                        ':sortKey': sortKey,
                    },
                    ExpressionAttributeNames: {
                        "#partitionKey": this.primaryIndex.partitionKey,
                        "#sortKey": this.primaryIndex.sortKey,
                    },
                }, options);
                params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
                this.client.query(params, (error, result) => {
                    if (error) {
                        reject(this.errorUtil.internalServerError("Query failed on " + params.TableName, error));
                    } else {
                        result = this._transformResults(result);
                        if (result.items.length === 0) {
                            result.items = null;
                        }
                        resolve(result);
                    }
                });
            });
        } else {
            throw new Error("Invalid parameters : partitionKey is missing.");
        }
    }

    _scanDual(options) {
        return new Promise((resolve, reject) => {
            const result = {
                items: [],
                consumedCapacity: 0,
                lastEvaluatedKey: null,
                scannedCount: 0,
                count: 0,
            };
            const params = this._addOptions({
                TableName: this.table,
            }, options);
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            const loadDataRecursive = params => {
                this.client.scan(params, (error, data) => {
                    if (error) {
                        reject(this.errorUtil.internalServerError("Scan failed on " + params.TableName, error));
                    } else {
                        this._addResults(result, this._transformResults(data));
                        if (result.lastEvaluatedKey) {
                            params.ExclusiveStartKey = result.lastEvaluatedKey;
                            loadDataRecursive(params);
                        } else {
                            resolve(result);
                        }
                    }
                });
            };
            loadDataRecursive(params);
        });
    }

    _getsDual(options) {
        return new Promise((resolve, reject) => {
            this._scanDual(options).then(result => {
                if (result.items === null) {
                    reject(this.errorUtil.notFoundError({ name: this.name, primary: this.primaryIndex.AttributeName }));
                } else {
                    resolve(result);
                }
            }).catch(reject);
        });
    }



    _getByIndexDual(index, partitionKey, sortKey, options) {
        if (partitionKey !== null) {
            return new Promise((resolve, reject) => {
                this._findByIndexDual(index, partitionKey, sortKey, options).then(result => {
                    if (result.items === null) {
                        reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey, sort: sortKey }));
                    } else {
                        resolve(result);
                    }
                }).catch(reject);
            });
        } else {
            throw new Error("Invalid parameters : partitionKey is missing.");
        }
    }

    _findByIndexDual(index, partitionKey, sortKey, options) {
        if (partitionKey !== null) {
            return new Promise((resolve, reject) => {
                const results = [];
                const params = {
                    TableName: this.table,
                    KeyConditionExpression: "#partitionKey = :partitionKey AND #sortKey = :sortKey",
                    ExpressionAttributeValues: {
                        ':partitionKey': partitionKey,
                        ':sortKey': sortKey
                    },
                    ExpressionAttributeNames: {
                        "#partitionKey": index.partitionKey,
                        "#sortKey": index.sortKey
                    },
                };
                params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
                const loadDataRecursive = params => {
                    this.client.query(params, (error, data) => {
                        if (error) {
                            reject(errorUtil.internalServerError("Query failed on " + params.TableName, error));
                        } else {
                            for (let i = 0; i < data.Items.length; i++) {
                                data.Items[i] = this.unwrap(data.Items[i]);
                                results.push(data.Items[i]);
                            }
                            if (data.LastEvaluatedKey) {
                                params.ExclusiveStartKey = data.LastEvaluatedKey;
                                loadDataRecursive(params);
                            } else {
                                resolve(results);
                            }
                        }
                    });
                };
                loadDataRecursive(params);
            });
        } else {
            throw new Error("Invalid parameters : partitionKey is missing.")
        }
    }

    _queryByIndexDual(index, partitionKey, sortkey, options) {
        return new Promise((resolve, reject) => {
            const params = this._addOptions({
                TableName: this.table,
                IndexName: index.IndexName,
                KeyConditionExpression: "#indexKey = :indexKey",
                ExpressionAttributeValues: {
                    ':indexKey': partitionKey,
                },
                ExpressionAttributeNames: {
                    "#indexKey": index.AttributeName,
                },
            }, options);
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            this.client.query(params, (error, result) => {
                if (error) {
                    reject(this.errorUtil.internalServerError("Query failed on " + params.TableName, error));
                } else {
                    result = this._transformResults(result);
                    if (result.items.length === 0) {
                        result.items = null;
                    }
                    resolve(result);
                }
            });
        });
    }

    _scanByIndexDual(index, options) {
        return new Promise((resolve, reject) => {
            const result = {
                items: [],
                consumedCapacity: 0,
                lastEvaluatedKey: null,
                scannedCount: 0,
                count: 0,
            };
            const params = this._addOptions({
                TableName: this.table,
                IndexName: index.IndexName,
            }, options);
            params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
            const loadDataRecursive = params => {
                this.client.scan(params, (error, data) => {
                    if (error) {
                        reject(this.errorUtil.internalServerError("Scan failed on " + params.TableName, error));
                    } else {
                        this._addResults(result, this._transformResults(data));
                        if (result.lastEvaluatedKey) {
                            params.ExclusiveStartKey = result.lastEvaluatedKey;
                            loadDataRecursive(params);
                        } else {
                            resolve(result);
                        }
                    }
                });
            };
            loadDataRecursive(params);
        });
    }

    _getsByIndexDual(index, partitionKey, sortkey, options) {
        if (partitionKey !== null) {
            return new Promise((resolve, reject) => {
                this._queryByIndexDual(index, partitionKey, sortkey, options).then(result => {
                    if (result.items === null) {
                        reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey }));
                    } else {
                        resolve(result);
                    }
                }).catch(reject);
            });
        } else {
            return new Promise((resolve, reject) => {
                this._scanByIndexDual(index, options).then(result => {
                    if (result.items === null) {
                        reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName }));
                    } else {
                        resolve(result);
                    }
                }).catch(reject);
            });
        }
    }

}

module.exports = Dynamodb;


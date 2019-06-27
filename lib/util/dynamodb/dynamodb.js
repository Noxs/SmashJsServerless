const aws = require('aws-sdk');
const Logger = require('../smashLogger');
const SmashError = require("../smashError");
const dynamodbDataTypes = require('dynamodb-data-types').AttributeValue;
const UNDERSCORE = "_";

class Dynamodb {
	constructor(configuration) {
		this.logger = new Logger("Dynamodb");
		this.errorUtil = new SmashError(this.logger);
		if (typeof configuration !== 'object') {
			throw new Error("First parameter of Dynamodb(configuration) must be an object, " + this.logger.typeOf(configuration));
		}
		this._table = this._sanityCheck(configuration.table, "table", "string", "configuration");
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
		this.client = new aws.DynamoDB();
		this._buildMetaDatabase();
	}

	_toCamelCase(name) {
		const splittedName = name.split(UNDERSCORE);
		return splittedName.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
	}

	_isVowel(char) {
		return char === "a" || char === "e" || char === "i" || char === "o" || char === "u" || char === "y";
	}

	_charIsVowel(word, position) {
		return this._isVowel(word[position]);
	}

	_endsWithByAtLeastOneOf(word, array) {
		for (let i = 0; i < array.length; i++) {
			if (word.endsWith(array[i]) === true) {
				return true;
			}
		}
		return false;
	}

	_notEndsWithByAll(word, array) {
		for (let i = 0; i < array.length; i++) {
			if (word.endsWith(array[i]) === true) {
				return false;
			}
		}
		return true;
	}

	_plural(word) {
		if (this._endsWithByAtLeastOneOf(word, ["s", "x", "ch", "sh", "o", "z"])) {
			return word + "es";
		}
		if (this._charIsVowel(word, word.length - 2) === false && word.endsWith("y")) {
			return word.substring(0, word.length - 1) + "ies";
		}
		if (this._endsWithByAtLeastOneOf(word, ["f", "fe"]) && this._notEndsWithByAll(word, ["ff", "ffe"]) && word.endsWith("f") === true) {
			return word.substring(0, word.length - 1) + "ves";
		}
		if (this._endsWithByAtLeastOneOf(word, ["f", "fe"]) && this._notEndsWithByAll(word, ["ff", "ffe"]) && word.endsWith("f") === false) {
			return word.substring(0, word.length - 2) + "ves";
		}
		return word + "s";
	}


	_sanityCheck(property, name, type, object) {
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
		}
		return this.wrapper.unwrap(item);
	}

	setClient(client) {
		this.client = client;
		return this;
	}

	get table() {
		return this._table;
	}

	_areStrings(array) {
		if (array.length === 0) {
			return false;
		}
		for (let i = 0; i < array.length; i++) {
			if (typeof array[i] !== "string") {
				return false;
			}
		}
		return true;
	}

	buildArgsForReadSingle(args) {
		if (args.length === 0) {
			return [null, {}];
		}
		if (args.length === 1 && typeof args[0] === "object") {
			return [null, args[0]];
		}
		if (args.length === 1 && typeof args[0] === "string") {
			return [args[0], {}];
		}
		if (args.length === 2 && typeof args[0] === "string" && typeof args[1] === "object") {
			return args;
		}
		throw new Error("Invalid function parameters");
	}

	buildArgsForReadDual(args) {
		if (args.length === 2 && this._areStrings([args[0], args[1]])) {
			return [args[0], args[1], {}];
		}
		if (args.length < 2 || (args.length === 2 && this._areStrings([args[0]]))) {
			const params = this.buildArgsForReadSingle(args);
			params.splice(1, 0, null);
			return params;
		}
		if (args.length === 3 && this._areStrings([args[0], args[1]]) && typeof args[2] === "object") {
			return args;
		}
		throw new Error("Invalid function parameters");
	}

	buildArgsForWrite(args) {
		if (args.length === 1 && typeof args[0] === "object") {
			return [args[0], {}];
		}
		if (args.length === 2 && typeof args[0] === "object" && typeof args[1] === "object") {
			return [args[0], args[1]];
		}
		throw new Error("Invalid function parameters");
	}

	buildPrimaryIndexMethod() {
		if (this.primaryIndex.sortKey) {
			this["get" + this.name] = (...args) => {
				return new Promise((resolve, reject) => {
					try {
						this._getDual(...this.buildArgsForReadDual(args)).resolve(resolve).reject(reject);
					} catch (error) {
						reject(error);
					}
				});
			};
			this["find" + this.name] = (...args) => {
				return new Promise((resolve, reject) => {
					try {
						this._findDual(...this.buildArgsForReadDual(args)).resolve(resolve).reject(reject);
					} catch (error) {
						reject(error);
					}
				});
			};
			this["get" + this._plural(this.name)] = (...args) => {
				return new Promise((resolve, reject) => {
					try {
						this._getsDual(...this.buildArgsForReadDual(args)).resolve(resolve).reject(reject);
					} catch (error) {
						reject(error);
					}
				});
			};
			this["post" + this.name] = (...args) => {
				return new Promise((resolve, reject) => {
					try {
						this._postDual(...this.buildArgsForWrite(args)).resolve(resolve).reject(reject);
					} catch (error) {
						reject(error);
					}
				});
			};
			this["put" + this.name] = (...args) => {
				return new Promise((resolve, reject) => {
					try {
						this._putDual(...this.buildArgsForWrite(args)).resolve(resolve).reject(reject);
					} catch (error) {
						reject(error);
					}
				});
			};
			this["delete" + this.name] = (...args) => {
				return new Promise((resolve, reject) => {
					try {
						this._deleteDual(...this.buildArgsForWrite(args)).resolve(resolve).reject(reject);
					} catch (error) {
						reject(error);
					}
				});
			};
		} else {
			this["get" + this.name] = (...args) => {
				return new Promise(async (resolve, reject) => {
					try {
						resolve(await this._getSingle(...this.buildArgsForReadSingle(args)));
					} catch (error) {
						reject(error);
					}
				});
			};
			this["find" + this.name] = (...args) => {
				return new Promise(async (resolve, reject) => {
					try {
						resolve(await this._findSingle(...this.buildArgsForReadSingle(args)));
					} catch (error) {
						reject(error);
					}
				});
			};
			this["get" + this._plural(this.name)] = (...args) => {
				return new Promise(async (resolve, reject) => {
					try {
						resolve(await this._getsSingle(...this.buildArgsForReadSingle(args)));
					} catch (error) {
						reject(error);
					}
				});
			};
			this["post" + this.name] = (...args) => {
				return new Promise(async (resolve, reject) => {
					try {
						resolve(await this._postSingle(...this.buildArgsForWrite(args)));
					} catch (error) {
						reject(error);
					}
				});
			};
			this["put" + this.name] = (...args) => {
				return new Promise(async (resolve, reject) => {
					try {
						resolve(await this._putSingle(...this.buildArgsForWrite(args)));
					} catch (error) {
						reject(error);
					}
				});
			};
			this["delete" + this.name] = (...args) => {
				return new Promise(async (resolve, reject) => {
					try {
						resolve(await this._deleteSingle(...this.buildArgsForWrite(args)));
					} catch (error) {
						reject(error);
					}
				});
			};
		}
	}

	buildSecondaryIndexMethod() {
		if (this.secondaryIndex && this.secondaryIndex.length !== 0) {
			this.secondaryIndex.forEach(index => {
				const camelCaseIndexName = this._toCamelCase(index.indexName);
				if (index.sortKey) {
					this["get" + this.name + "By" + camelCaseIndexName] = (...args) => {
						return new Promise(async (resolve, reject) => {
							const _index = index;
							try {
								resolve(await this._getByIndexDual(_index, ...this.buildArgsForReadDual(args)));
							} catch (error) {
								reject(error);
							}
						});
					};
					this["find" + this.name + "By" + camelCaseIndexName] = (...args) => {
						return new Promise(async (resolve, reject) => {
							const _index = index;
							try {
								resolve(await this._findByIndexDual(_index, ...this.buildArgsForReadDual(args)));
							} catch (error) {
								reject(error);
							}
						});
					};
					this["get" + this._plural(this.name) + "By" + camelCaseIndexName] = (...args) => {
						return new Promise(async (resolve, reject) => {
							const _index = index;
							try {
								resolve(await this._getsByIndexDual(_index, ...this.buildArgsForReadDual(args)));
							} catch (error) {
								reject(error);
							}
						});
					};
				} else {
					this["get" + this.name + "By" + camelCaseIndexName] = (...args) => {
						return new Promise(async (resolve, reject) => {
							const _index = index;
							try {
								resolve(await this._getByIndexSingle(_index, ...this.buildArgsForReadSingle(args)));
							} catch (error) {
								reject(error);
							}
						});
					};
					this["find" + this.name + "By" + camelCaseIndexName] = (...args) => {
						return new Promise(async (resolve, reject) => {
							const _index = index;
							try {
								resolve(await this._findByIndexSingle(_index, ...this.buildArgsForReadSingle(args)));
							} catch (error) {
								reject(error);
							}
						});
					};
					this["get" + this._plural(this.name) + "By" + camelCaseIndexName] = (...args) => {
						return new Promise(async (resolve, reject) => {
							const _index = index;
							try {
								resolve(await this._getsByIndexSingle(_index, ...this.buildArgsForReadSingle(args)));
							} catch (error) {
								reject(error);
							}
						});
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
		if (convertedResult.items && convertedResult.items.length !== 0) {
			result.items = result.items.concat(convertedResult.items);
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
		indexes[partitionKey] = data[partitionKey];
		if (sortKey) {
			indexes[sortKey] = data[sortKey];
		}
		return indexes;
	}

	_getSingle(partitionKey, options) {
		return new Promise((resolve, reject) => {
			this._findSingle(partitionKey, options).then(result => {
				if (result.items === null) {
					reject(this.errorUtil.notFoundError({ name: this.name, primary: partitionKey }));
				} else {
					resolve(result);
				}
			}).catch(reject);
		});
	}

	_findSingle(partitionKey, options) {
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
					reject(this.errorUtil.conflictError({ name: this.name, primary: item[this.primaryIndex.partitionKey] }));
				} else if (error) {
					error.itemToPushed = item;
					reject(this.errorUtil.internalServerError("Failed to put uniq item in " + params.TableName, error));
				} else {
					resolve(this._transformResults(data));
				}
			});
		});
	}

	_putSingle(item, options) {
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
					reject(this.errorUtil.internalServerError("Failed to put item in " + params.TableName, error));
				} else {
					resolve(this._transformResults(data));
				}
			});
		});
	}

	_deleteSingle(item, partitionKey, options) {
		return new Promise((resolve, reject) => {
			const indexes = this._buildObjectToDelete(item, { partitionKey });
			const params = this._addOptions({
				TableName: this.table,
				Key: this.wrap(indexes),
			}, options);
			this.client.deleteItem(params, (error, data) => {
				if (error) {
					error.itemToDelete = item;
					reject(this.errorUtil.internalServerError("Failed to delete item in " + params.TableName, error));
				} else {
					resolve(this._transformResults(data));
				}
			});
		});
	}

	_getByIndexSingle(index, partitionKey, options) {
		return new Promise((resolve, reject) => {
			this._findByIndexSingle(index, partitionKey, options).then(result => {
				if (result.items === null) {
					reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey }));
				} else {
					resolve(result);
				}
			}).catch(reject);
		});
	}

	_findByIndexSingle(index, partitionKey, options) {
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
		return new Promise((resolve, reject) => {
			if (partitionKey === null) {
				this._scanByIndexSingle(index, options).then(result => {
					if (result.items === null) {
						reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName }));
					} else {
						resolve(result);
					}
				}).catch(reject);
			} else {
				this._queryByIndexSingle(index, partitionKey, options).then(result => {
					if (result.items === null) {
						reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey }));
					} else {
						resolve(result);
					}
				}).catch(reject);
			}
		});
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
			const params = this._addOptions({
				TableName: this.table,
				KeyConditionExpression: "#partitionKey = :partitionKey AND #sortKey = :sortKey",
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
			const loadDataRecursive = params => {
				this.client.query(params, (error, data) => {
					if (error) {
						reject(this.errorUtil.internalServerError("Query failed on " + params.TableName, error));
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
		return new Promise((resolve, reject) => {
			this._findByIndexDual(index, partitionKey, sortKey, options).then(result => {
				if (result.items === null) {
					reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey, sort: sortKey }));
				} else {
					resolve(result);
				}
			}).catch(reject);
		});
	}

	_findByIndexDual(index, partitionKey, sortKey, options) {
		return new Promise((resolve, reject) => {
			const results = [];
			const params = this._addOptions({
				TableName: this.table,
				KeyConditionExpression: "#partitionKey = :partitionKey AND #sortKey = :sortKey",
				ExpressionAttributeValues: {
					':partitionKey': partitionKey,
					':sortKey': sortKey,
				},
				ExpressionAttributeNames: {
					"#partitionKey": index.partitionKey,
					"#sortKey": index.sortKey,
				},
			}, options);
			params.ExpressionAttributeValues = this.wrap(params.ExpressionAttributeValues);
			const loadDataRecursive = params => {
				this.client.query(params, (error, data) => {
					if (error) {
						reject(this.errorUtil.internalServerError("Query failed on " + params.TableName, error));
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

	_queryByIndexDual(index, partitionKey, sortKey, options) {
		return new Promise((resolve, reject) => {
			this._findByIndexDual(index, partitionKey, sortKey, options).then(result => {
				if (result.items === null) {
					reject(this.errorUtil.notFoundError({ name: this.name, primary: partitionKey, sort: sortKey }));
				} else {
					resolve(result);
				}
			}).catch(reject);
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
		return new Promise((resolve, reject) => {
			if (partitionKey === null) {
				this._scanByIndexDual(index, options).then(result => {
					if (result.items === null) {
						reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName }));
					} else {
						resolve(result);
					}
				}).catch(reject);
			} else {
				this._queryByIndexSingle(index, partitionKey, options).then(result => {
					if (result.items === null) {
						reject(this.errorUtil.notFoundError({ name: this.name, secondary: index.AttributeName, key: partitionKey }));
					} else {
						resolve(result);
					}
				}).catch(reject);
			}
		});
	}
}

module.exports = Dynamodb;


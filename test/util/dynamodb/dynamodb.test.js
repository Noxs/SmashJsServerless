const MockDate = require('mockdate');
const Dynamodb = require("../../../lib/util/dynamodb/dynamodb");
const configurationTest = require('./dynamodb.data');

describe('Dynamodb', () => {
	const tableName = "Transfer";
	it('Test Dynamodb instance failure', () => {
		expect(() => {
			new Dynamodb();
		}).toThrow(Error);

		expect(() => {
			new Dynamodb("FOOBAR");
		}).toThrow(Error);

		expect(() => {
			new Dynamodb({});
		}).toThrow(Error);

		expect(() => {
			new Dynamodb({
				table: "table",
			});
		}).toThrow(Error);

		expect(() => {
			new Dynamodb({
				table: "table", name: "name",
			});
		}).toThrow(Error);

		expect(() => {
			new Dynamodb({
				table: "table",
				name: "name",
				suffix: "suffix",
			});
		}).toThrow(Error);

		expect(() => {
			new Dynamodb({
				table: "table",
				name: "name",
				suffix: "suffix",
				primaryIndex: {},
			});
		}).toThrow(Error);

		expect(() => {
			new Dynamodb({
				table: "table",
				name: "name",
				suffix: "suffix",
				primaryIndex: {
					partitionKey: "partitionKey",
				}
			});
		}).toThrow(Error);

		expect(() => {
			new Dynamodb({
				table: "table",
				name: "name",
				suffix: "suffix",
				primaryIndex: {
					partitionKey: "partitionKey",
					sortKey: "sortKey",
				}
			});
		}).toThrow(Error);
	});

	it('Test Dynamodb instance success', () => {
		expect(() => {
			const configuration = configurationTest.goodDual;
			new Dynamodb(configuration);
		}).not.toThrow(Error);
	});

	it('Test plural', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		expect(db._plural("arch")).toBe("arches");
		expect(db._plural("buzz")).toBe("buzzes");
		expect(db._plural("alley")).toBe("alleys");
		expect(db._plural("ally")).toBe("allies");
		expect(db._plural("calf")).toBe("calves");
		expect(db._plural("knife")).toBe("knives");
		expect(db._plural("buffalo")).toBe("buffaloes");
		expect(db._plural("bluff")).toBe("bluffs");
		expect(db._plural("index")).toBe("indexes");
	});

	it('Test Dynamodb instance success method primary index', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		expect(db).toHaveProperty('get' + tableName);
		expect(db).toHaveProperty('delete' + tableName);
		expect(db).toHaveProperty('post' + tableName);
		expect(db).toHaveProperty('put' + tableName);
		expect(db).toHaveProperty('get' + tableName + 's');
	});

	it('Test Dynamodb instance success method secondary indexes', () => {
		const configuration = configurationTest.goodSingle;
		const db = new Dynamodb(configuration);

		expect(db).toHaveProperty('get' + tableName);
		expect(db).toHaveProperty('delete' + tableName);
		expect(db).toHaveProperty('post' + tableName);
		expect(db).toHaveProperty('put' + tableName);
		expect(db).toHaveProperty('get' + tableName + 's');
		expect(db).toHaveProperty('get' + tableName + 'ByIndexTest1');
		expect(db).toHaveProperty('find' + tableName + 'ByIndexTest1');
		expect(db).toHaveProperty('get' + tableName + 's' + 'ByIndexTest1');
		expect(db).toHaveProperty('get' + tableName + 'ByIndexTest2');
		expect(db).toHaveProperty('find' + tableName + 'ByIndexTest2');
		expect(db).toHaveProperty('get' + tableName + 's' + 'ByIndexTest2');
	});

	it('Test Dynamodb instance failure secondary indexes', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);

		expect(db).not.toHaveProperty('findByIndex');
		expect(db).not.toHaveProperty('findByIndexTest3');
	});

	it('Test Dynamodb wrapper wrap function', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const item = { test: "test", testArray: ["item1", "item2"] };
		const expectedWrappedItem = { test: { S: 'test' }, testArray: { SS: ['item1', 'item2'] } }
		const wrappedItem = db.wrap(item);
		expect(wrappedItem).toStrictEqual(expectedWrappedItem);
	});

	it('Test Dynamodb wrapper unwrap function', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const wrappedItem = { test: { S: 'test' }, testArray: { SS: ['item1', 'item2'] } };
		const expectedUnwrappedItem = { test: "test", testArray: ["item1", "item2"] };
		const unwrappedItem = db.unwrap(wrappedItem);
		expect(unwrappedItem).toStrictEqual(expectedUnwrappedItem);
	});

	it('Test _toCamelCase case 1', () => {
		const name = "application_code";
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		expect(db._toCamelCase(name)).toBe('ApplicationCode');
	});

	it('Test _toCamelCase case 2', () => {
		const name = "application_code_test_code_dev";
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		expect(db._toCamelCase(name)).toBe('ApplicationCodeTestCodeDev');
	});

	it('Test _toCamelCase case 3', () => {
		const name = "report";
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		expect(db._toCamelCase(name)).toBe('Report');
	});

	it('Test _areStrings', () => {
		const array1 = ["report"];
		const array2 = ["report", "test"];
		const array3 = [];
		const array4 = [{}, "test"];
		const array5 = [{}, {}];
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		expect(db._areStrings(array1)).toBe(true);
		expect(db._areStrings(array2)).toBe(true);
		expect(db._areStrings(array3)).toBe(false);
		expect(db._areStrings(array4)).toBe(false);
		expect(db._areStrings(array5)).toBe(false);
	});

	it('Test Dynamodb client', () => {

	});

	it('Test Dynamodb prefix', () => {

	});

	it('Test Dynamodb table', () => {

	});

	it('Test Dynamodb _buildMetaDatabase', () => {

	});

	it('Test Dynamodb _transformResults', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);

		const mockedResult = {
			Items: [{ test1: { S: 'test1' } }, { test2: { S: 'test2' } }],
			ConsumedCapacity: 0,
			LastEvaluatedKey: null,
			ScannedCount: 2,
			Count: 2,
		};

		const expectedTransformedResult = {
			items: [{ test1: "test1" }, { test2: "test2" }],
			consumedCapacity: 0,
			scannedCount: 2,
			count: 2,
		};

		const mockedTransformedResult = db._transformResults(mockedResult);
		expect(mockedTransformedResult).toStrictEqual(expectedTransformedResult);
	});

	it('Test Dynamodb _addResults', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);

		const result = {
			items: [],
			consumedCapacity: 0,
			lastEvaluatedKey: null,
			scannedCount: 0,
			count: 0,
		};

		const mockedTransformedResult = {
			items: [{ test1: "test1" }, { test2: "test2" }],
			consumedCapacity: 0,
			scannedCount: 2,
			count: 2,
		};

		const expectedResult = {
			items: [{ test1: "test1" }, { test2: "test2" }],
			consumedCapacity: 0,
			lastEvaluatedKey: null,
			scannedCount: 2,
			count: 2,
		};

		expect(db._addResults(result, mockedTransformedResult)).toStrictEqual(expectedResult);
	});

	it('Test Dynamodb _addOptions', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const options = {
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		};
		const params = {
			TableName: this.name,
			KeyConditionExpression: "#partitionKey = :partitionKey",
			ExpressionAttributeValues: {
				':partitionKey': "partitionKey",
			},
			ExpressionAttributeNames: {
				"#partitionKey": "partitionKey",
			},
		};
		const expectedParams = {
			TableName: this.name,
			KeyConditionExpression: "#partitionKey = :partitionKey",
			ExpressionAttributeValues: {
				':partitionKey': "partitionKey",
			},
			ExpressionAttributeNames: {
				"#partitionKey": "partitionKey",
			},
			ScanIndexForward: 1,
			ExclusiveStartKey: 1,
			Limit: 1,
		};

		expect(db._addOptions(params, options)).toStrictEqual(expectedParams);
	});

	it('Test Dynamodb _addOptions with null options', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const options = {};
		const params = {
			TableName: this.table,
			KeyConditionExpression: "#partitionKey = :partitionKey",
			ExpressionAttributeValues: {
				':partitionKey': "partitionKey",
			},
			ExpressionAttributeNames: {
				"#partitionKey": "partitionKey",
			},
		};
		const expectedParams = {
			TableName: this.table,
			KeyConditionExpression: "#partitionKey = :partitionKey",
			ExpressionAttributeValues: {
				':partitionKey': "partitionKey",
			},
			ExpressionAttributeNames: {
				"#partitionKey": "partitionKey",
			},
		};

		expect(db._addOptions(params, options)).toStrictEqual(expectedParams);
	});

	it('Test Dynamodb buildArgsForReadSingle two args', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = ["test", {}];
		const expectedReturnedArgs = ["test", {}];
		expect(db.buildArgsForReadSingle(args)).toStrictEqual(expectedReturnedArgs);
	});

	it('Test Dynamodb buildArgsForReadSingle 1 args (option)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = [{
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}];
		const expectedReturnedArgs = [null, {
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}];
		expect(db.buildArgsForReadSingle(args)).toStrictEqual(expectedReturnedArgs);
	});

	it('Test Dynamodb buildArgsForReadSingle 1 args (key)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = ["test"];
		const expectedReturnedArgs = ["test", {}];
		expect(db.buildArgsForReadSingle(args)).toStrictEqual(expectedReturnedArgs);
	});

	it('Test Dynamodb buildArgsForReadDual 2 args (partitionKey, sortKey)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = ["test1", "test2"];
		const expectedReturnedArgs = ["test1", "test2", {}];
		expect(db.buildArgsForReadDual(args)).toEqual(expectedReturnedArgs);
	});

	it('Test Dynamodb buildArgsForReadDual 1 args (option)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = [{
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}];
		const expectedReturnedArgs = [null, null, {
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}];
		expect(db.buildArgsForReadDual(args)).toEqual(expectedReturnedArgs);
	});

	it('Test Dynamodb buildArgsForReadDual 2 args (partitionKey, options)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = ["test", {
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}];
		const expectedReturnedArgs = ["test", null, {
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}];
		expect(db.buildArgsForReadDual(args)).toStrictEqual(expectedReturnedArgs);
	});

	it('Test Dynamodb buildArgsForReadDual failure with 2 args (option, partitionKey)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = [{
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}, "test"];
		expect(() => db.buildArgsForReadDual(args)).toThrow();
	});

	it('Test Dynamodb buildArgsForWrite success with 1 arg (object)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = [{}];
		expect(() => db.buildArgsForWrite(args)).not.toThrow();
		expect(db.buildArgsForWrite(args)).toEqual([{}, {}]);
	});

	it('Test Dynamodb buildArgsForWrite success with 2 args (object, option)', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const args = [{}, {
			scanIndexForward: 1,
			exclusiveStartKey: 1,
			limit: 1,
		}];
		expect(() => db.buildArgsForWrite(args)).not.toThrow();
		expect(db.buildArgsForWrite(args)).toEqual(args);
	});

	it('Test Dynamodb _buildObjectToDelete case 1', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const data = { first: "partionKeyFirst", test: "test", test1: "test1" };
		expect(db._buildObjectToDelete(data, { partitionKey: "first" })).toEqual({ first: "partionKeyFirst" });
	});

	it('Test Dynamodb _buildObjectToDelete case 2', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const data = { first: "partionKeyFirst", second: "partionKeySecond", test: "test", test1: "test1" };
		expect(db._buildObjectToDelete(data, { partitionKey: "first", sortKey: "second" })).toEqual({ first: "partionKeyFirst", second: "partionKeySecond" });
	});
});

describe('Dynamodb mocked tests for primary index', () => {
	it('Test Dynamodb _getSingle', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration)

		db.client.query = jest.fn((params, cb) => {
			cb(null, { Items: db.wrap([{ test: "test" }]) });
		});

		const result = await db._getSingle("test", {});
		expect(result.items).toStrictEqual([{ test: "test" }]);
	});

	it('Test Dynamodb _findSingle', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);

		db.client.query = jest.fn((params, cb) => {
			cb(null, { Items: db.wrap([{ test: "test" }]) });
		});

		const result = await db._findSingle("test", {});
		expect(result.items).toStrictEqual([{ test: "test" }]);
	});

	it('Test Dynamodb _getsSingle', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);

		const mockResult = {
			Items: db.wrap([{ test: "test" }, { test: "test1" }]),
			ConsumedCapacity: 0,
			LastEvaluatedKey: null,
			ScannedCount: 2,
			Count: 2,
		};
		const expectedResult = {
			items: [{ test: "test" }, { test: "test1" }],
			consumedCapacity: 0,
			lastEvaluatedKey: null,
			scannedCount: 2,
			count: 2,
		};

		db.client.scan = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		const result = await db._getsSingle("test", {});
		expect(result).toStrictEqual(expectedResult);
	});

	it('Test Dynamodb _postSingle', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		MockDate.set('2019-06-19T09:01:29.547Z');
		const objectToPost = {
			"name": "test",
			"description": "test",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};

		const mockResult = {
			Items: db.wrap([{
				"created": new Date().toISOString(),
				"name": "test",
				"description": "test",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};

		const objectToReceive = {
			"created": new Date().toISOString(),
			"name": "test",
			"description": "test",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};

		db.client.putItem = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		const result = await db._postSingle(objectToPost, {});
		expect(result.items).toStrictEqual([objectToReceive]);
	});

	it('Test Dynamodb _putSingle', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		MockDate.set('2019-06-20T09:01:29.547Z');
		const objectToPost = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};

		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"modified": new Date().toISOString(),
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};


		db.client.putItem = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		const result = await db._putSingle(objectToPost, {});
		expect(result.items).toStrictEqual([objectToPost]);
	});

	it('Test Dynamodb _deleteSingle', () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
	});
});

describe('Dynamodb mocked tests for secondary index', () => {
	it('Test Dynamodb _getByIndexSingle', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);

		db.client.query = jest.fn((params, cb) => {
			cb(null, { Items: db.wrap([{ test: "test" }]) });
		});

		const result = await db._getByIndexSingle(db.secondaryIndex[0], "test", {});
		expect(result.items).toStrictEqual([{ test: "test" }]);
	});

	it('Test Dynamodb _findByIndexSingle', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);

		db.client.query = jest.fn((params, cb) => {
			cb(null, { Items: db.wrap([{ test: "test" }]) });
		});

		const result = await db._findByIndexSingle(db.secondaryIndex[0], "test", {});
		expect(result.items).toStrictEqual([{ test: "test" }]);
	});

	// it('Test Dynamodb _findByIndexSingle without partitionKey', async () => {
	//     const configuration = configurationTest.goodDual;
	//     const db = new Dynamodb(configuration);

	//     db.client.query = jest.fn((params, cb) => {
	//         cb(null, { Items: db.wrap([{ test: "test" }]) });
	//     });

	//     const result = await db._findByIndexSingle(db.secondaryIndex[0], "test", {});
	//     expect(result.items).toStrictEqual([{ test: "test" }]);
	// });

	it('Test Dynamodb _getsByIndexSingle with null key', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};
		const expectedResult = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};
		db.client.scan = jest.fn((params, cb) => {
			cb(null, (mockResult));
		});

		const result = await db._getsByIndexSingle(db.secondaryIndex[0], null, {});
		expect(result.items).toStrictEqual([expectedResult]);
	});

	it('Test Dynamodb _getsByIndexSingle with key not null', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					}
				]
			}])
		};
		const expectedResult = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};
		db.client.query = jest.fn((params, cb) => {
			cb(null, (mockResult));
		});

		db.client.scan = jest.fn((params, cb) => {
			cb(null, (mockResult));
		});

		const result = await db._getsByIndexSingle(db.secondaryIndex[0], "test", {});
		expect(result.items).toStrictEqual([expectedResult]);
	});
});


describe('Dynamodb mocked tests with real function names and no sort key', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
	});

	it('Test Dynamodb _getSingle with partition key', async () => {
		const configuration = configurationTest.goodSingle;
		const db = new Dynamodb(configuration);
		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};
		const expectedResult = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};
		db.client.query = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		/* 	db.getTransfer("test").then(result => {
				expect(result.items).toStrictEqual([expectedResult]);
				done();
			}); */
		const result = await db.getTransfer("test");
		await expect(result.items).toStrictEqual([expectedResult]);
	});

	// it('Test Dynamodb _getSingle failure with no key', async () => {
	//     const configuration = configurationTest.goodSingle;
	//     const db = new Dynamodb(configuration);

	//     expect(db.getTransfer()).toThrow(Error("Invalid parameters for function _getByIndexSingle"));
	// });

});

describe('Dynamodb mocked tests for secondary index with real names', () => {
	const options = {
		scanIndexForward: 1,
		exclusiveStartKey: 1,
		limit: 1,
	};

	it('Test Dynamodb _getByIndexSingle with single config', async () => {
		const configuration = configurationTest.goodSingle;
		const db = new Dynamodb(configuration);
		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};
		const expectedResult = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};
		db.client.query = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		const result = await db.getTransferByIndexTest1("test");
		expect(result.items).toStrictEqual([expectedResult]);
	});

	it('Test Dynamodb _getByIndexSingle with options', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};
		const expectedResult = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};
		db.client.query = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		const result = await db.getTransferByIndexTest1("test", { options });
		expect(result).toStrictEqual([expectedResult]);
	});

	it('Test Dynamodb _getsByIndexSingle with options', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};
		const expectedResult = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};

		db.client.scan = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		const result = await db.getTransfersByIndexTest1({ options });
		expect(result.items).toStrictEqual([expectedResult]);
	});

	it('Test Dynamodb _getsByIndexSingle with partition key and options', async () => {
		const configuration = configurationTest.goodDual;
		const db = new Dynamodb(configuration);
		const mockResult = {
			Items: db.wrap([{
				"created": '2019-06-19T09:01:29.547Z',
				"name": "test2",
				"description": "test2",
				"statement": [
					{
						"action": "test",
						"effect": "Allow",
						"resource": "*",
					},
				],
			}]),
		};
		const expectedResult = {
			"created": '2019-06-19T09:01:29.547Z',
			"name": "test2",
			"description": "test2",
			"statement": [
				{
					"action": "test",
					"effect": "Allow",
					"resource": "*",
				},
			],
		};

		db.client.query = jest.fn((params, cb) => {
			cb(null, mockResult);
		});

		const result = await db.getTransfersByIndexTest1("test", { options });
		expect(result.items).toStrictEqual([expectedResult]);
	});

	// it('Test Dynamodb _getsByIndexDual with key not null', async () => {
	//     const configuration = configurationTest.goodDual;
	//     const db = new Dynamodb(configuration);
	//     const mockResult = {
	//         Items: db.wrap([{
	//             "created": '2019-06-19T09:01:29.547Z',
	//             "name": "test2",
	//             "description": "test2",
	//             "statement": [
	//                 {
	//                     "action": "test",
	//                     "effect": "Allow",
	//                     "resource": "*"
	//                 }
	//             ]
	//         }])
	//     };
	//     const expectedResult = {
	//         "created": '2019-06-19T09:01:29.547Z',
	//         "name": "test2",
	//         "description": "test2",
	//         "statement": [
	//             {
	//                 "action": "test",
	//                 "effect": "Allow",
	//                 "resource": "*"
	//             }
	//         ]
	//     };

	//     db.client.scan = jest.fn((params, cb) => {
	//         cb(null, mockResult);
	//     });

	//     const result = await db.getTableNamesByIndexTest1("test", "test", {});
	//     expect(result.items).toStrictEqual([expectedResult]);
	// });

});

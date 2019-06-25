const aws = require('aws-sdk');
var MockDate = require('mockdate');
const Dynamodb = require("../../lib/util/dynamodb");
const configurationTest = require('./dynamodb.data');
const dynamodbDataTypes = require('dynamodb-data-types').AttributeValue;

describe('Dynamodb', function () {
    const tableName = "Transfer";
    it('Test Dynamodb instance failure', function () {
        expect(function () {
            const db = new Dynamodb();
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb("FOOBAR");
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb({});
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb({
                table: "table",
            });
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb({
                table: "table", name: "name",
            });
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb({
                table: "table",
                name: "name",
                suffix: "suffix",
            });
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb({
                table: "table",
                name: "name",
                suffix: "suffix",
                primaryIndex: {},
            });
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb({
                table: "table",
                name: "name",
                suffix: "suffix",
                primaryIndex: {
                    partitionKey: "partitionKey",
                }
            });
        }).toThrow(Error);

        expect(function () {
            const db = new Dynamodb({
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

    it('Test Dynamodb instance success', function () {
        expect(function () {
            const configuration = configurationTest.goodDual;
            const db = new Dynamodb(configuration);
        }).not.toThrow(Error);
    });

    it('Test Dynamodb instance success method primary index', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        expect(db).toHaveProperty('get' + tableName);
        expect(db).toHaveProperty('delete' + tableName);
        expect(db).toHaveProperty('post' + tableName);
        expect(db).toHaveProperty('put' + tableName);
        expect(db).toHaveProperty('get' + tableName + 's');

    });

    it('Test Dynamodb instance success method secondary indexes', function () {
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

    it('Test Dynamodb instance failure secondary indexes', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);

        expect(db).not.toHaveProperty('findByIndex');
        expect(db).not.toHaveProperty('findByIndexTest3');
    });

    it('Test Dynamodb wrapper wrap function', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const wrapper = dynamodbDataTypes;
        const item = { test: "test", testArray: ["item1", "item2"] };
        const expectedWrappedItem = { test: { S: 'test' }, testArray: { SS: ['item1', 'item2'] } }
        const wrappedItem = db.wrap(item);
        expect(wrappedItem).toStrictEqual(expectedWrappedItem);
    });

    it('Test Dynamodb wrapper unwrap function', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const wrapper = dynamodbDataTypes;
        const wrappedItem = { test: { S: 'test' }, testArray: { SS: ['item1', 'item2'] } }
        const expectedUnwrappedItem = { test: "test", testArray: ["item1", "item2"] };
        const unwrappedItem = db.unwrap(wrappedItem);
        expect(unwrappedItem).toStrictEqual(expectedUnwrappedItem);
    });

    it('Test Dynamodb client', function () {
        const name = "application_code";
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        expect(db._toCamelCase(name)).toBe('ApplicationCode');
    });

    it('Test Dynamodb client', function () {

    });

    it('Test Dynamodb prefix', function () {

    });

    it('Test Dynamodb table', function () {

    });

    it('Test Dynamodb _buildMetaDatabase', function () {

    });

    it('Test Dynamodb _transformResults', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);

        const mockedResult = {
            Items: [{ test1: { S: 'test1' } }, { test2: { S: 'test2' } }],
            ConsumedCapacity: 0,
            LastEvaluatedKey: null,
            ScannedCount: 2,
            Count: 2
        };

        const expectedTransformedResult = {
            items: [{ test1: "test1" }, { test2: "test2" }],
            consumedCapacity: 0,
            scannedCount: 2,
            count: 2
        };

        const mockedTransformedResult = db._transformResults(mockedResult);
        expect(mockedTransformedResult).toStrictEqual(expectedTransformedResult);
    });

    it('Test Dynamodb _addResults', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);

        let result = {
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
            count: 2
        };

        const expectedResult = {
            items: [{ test1: "test1" }, { test2: "test2" }],
            consumedCapacity: 0,
            lastEvaluatedKey: null,
            scannedCount: 2,
            count: 2
        };

        expect(db._addResults(result, mockedTransformedResult)).toStrictEqual(expectedResult);
    });

    it('Test Dynamodb _addOptions', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const options = {
            scanIndexForward: 1,
            exclusiveStartKey: 1,
            limit: 1
        };
        const params = {
            TableName: this.name,
            KeyConditionExpression: "#partitionKey = :partitionKey",
            ExpressionAttributeValues: {
                ':partitionKey': "partitionKey",
            },
            ExpressionAttributeNames: {
                "#partitionKey": "partitionKey",
            }
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
            Limit: 1
        };

        expect(db._addOptions(params, options)).toStrictEqual(expectedParams);
    });

    it('Test Dynamodb _addOptions with null options', function () {
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
            }
        };
        const expectedParams = {
            TableName: this.table,
            KeyConditionExpression: "#partitionKey = :partitionKey",
            ExpressionAttributeValues: {
                ':partitionKey': "partitionKey",
            },
            ExpressionAttributeNames: {
                "#partitionKey": "partitionKey",
            }
        };

        expect(db._addOptions(params, options)).toStrictEqual(expectedParams);
    });

    it('Test Dynamodb buildArgsForSingle two args', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const args = ["test", {}];
        const expectedReturnedArgs = ["test", {}];
        expect(db.buildArgsForSingle(args)).toStrictEqual(expectedReturnedArgs);
    });

    it('Test Dynamodb buildArgsForSingle 1 args (option)', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const args = [{
            scanIndexForward: 1,
            exclusiveStartKey: 1,
            limit: 1
        }];
        const expectedReturnedArgs = [null, {
            scanIndexForward: 1,
            exclusiveStartKey: 1,
            limit: 1
        }];
        expect(db.buildArgsForSingle(args)).toStrictEqual(expectedReturnedArgs);
    });

    it('Test Dynamodb buildArgsForSingle 1 args (key)', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const args = ["test"];
        const expectedReturnedArgs = ["test", {}];
        expect(db.buildArgsForSingle(args)).toStrictEqual(expectedReturnedArgs);
    });

    it('Test Dynamodb buildArgsForDual 2 args (partitionKey, sortKey)', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const args = ["test", "test"];
        const expectedReturnedArgs = ["test", "test", {}];
        expect(db.buildArgsForDual(args)).toStrictEqual(expectedReturnedArgs);
    });

    it('Test Dynamodb buildArgsForDual 1 args (option)', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const args = [{
            scanIndexForward: 1,
            exclusiveStartKey: 1,
            limit: 1
        }];
        const expectedReturnedArgs = [null, null, {
            scanIndexForward: 1,
            exclusiveStartKey: 1,
            limit: 1
        }];
        expect(db.buildArgsForDual(args)).toStrictEqual(expectedReturnedArgs);
    });

    it('Test Dynamodb buildArgsForDual 2 args (partitionKey, options)', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);
        const args = ["test", {
            scanIndexForward: 1,
            exclusiveStartKey: 1,
            limit: 1
        }];
        const expectedReturnedArgs = ["test", null, {
            scanIndexForward: 1,
            exclusiveStartKey: 1,
            limit: 1
        }];
        expect(db.buildArgsForDual(args)).toStrictEqual(expectedReturnedArgs);
    });

    // it('Test Dynamodb buildArgsForDual failure with 2 args (option, partitionKey)', function () {
    //     const configuration = configurationTest.goodDual;
    //     const db = new Dynamodb(configuration);
    //     const args = [{
    //         scanIndexForward: 1,
    //         exclusiveStartKey: 1,
    //         limit: 1
    //     }, "test"];

    //     expect(db.buildArgsForDual(args)).toThrow(Error);
    // });

    // it('Test Dynamodb _buildObjectToDelete', function () {
    //     const configuration = configurationTest.goodDual;
    //     const db = new Dynamodb(configuration);


    // });

});

describe('Dynamodb mocked tests for primary index', function () {

    it('Test Dynamodb _getSingle', async function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration)

        db.client.query = jest.fn((params, cb) => {
            cb(null, { Items: db.wrap([{ test: "test" }]) });
        });

        const result = await db._getSingle("test", {});
        expect(result.items).toStrictEqual([{ test: "test" }]);
    });

    it('Test Dynamodb _findSingle', async function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);

        db.client.query = jest.fn((params, cb) => {
            cb(null, { Items: db.wrap([{ test: "test" }]) });
        });

        const result = await db._findSingle("test", {});
        expect(result.items).toStrictEqual([{ test: "test" }]);
    });

    it('Test Dynamodb _getsSingle', async function () {
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

    it('Test Dynamodb _postSingle', async function () {
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
                    "resource": "*"
                }
            ]
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
                        "resource": "*"
                    }
                ]
            }])
        };

        const objectToReceive = {
            "created": new Date().toISOString(),
            "name": "test",
            "description": "test",
            "statement": [
                {
                    "action": "test",
                    "effect": "Allow",
                    "resource": "*"
                }
            ]
        };

        db.client.putItem = jest.fn((params, cb) => {
            cb(null, mockResult);
        });

        const result = await db._postSingle(objectToPost, {});
        expect(result.items).toStrictEqual([objectToReceive]);
    });

    it('Test Dynamodb _putSingle', async function () {
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
                    "resource": "*"
                }
            ]
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
                        "resource": "*"
                    }
                ]
            }])
        };


        db.client.putItem = jest.fn((params, cb) => {
            cb(null, mockResult);
        });

        const result = await db._putSingle(objectToPost, {});
        expect(result.items).toStrictEqual([objectToPost]);
    });

    it('Test Dynamodb _deleteSingle', function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);

    });

});

describe('Dynamodb mocked tests for secondary index', function () {

    it('Test Dynamodb _getByIndexSingle', async function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);

        db.client.query = jest.fn((params, cb) => {
            cb(null, { Items: db.wrap([{ test: "test" }]) });
        });

        const result = await db._getByIndexSingle(db.secondaryIndex[0], "test", {});
        expect(result.items).toStrictEqual([{ test: "test" }]);
    });

    it('Test Dynamodb _findByIndexSingle', async function () {
        const configuration = configurationTest.goodDual;
        const db = new Dynamodb(configuration);

        db.client.query = jest.fn((params, cb) => {
            cb(null, { Items: db.wrap([{ test: "test" }]) });
        });

        const result = await db._findByIndexSingle(db.secondaryIndex[0], "test", {});
        expect(result.items).toStrictEqual([{ test: "test" }]);
    });

    // it('Test Dynamodb _findByIndexSingle without partitionKey', async function () {
    //     const configuration = configurationTest.goodDual;
    //     const db = new Dynamodb(configuration);

    //     db.client.query = jest.fn((params, cb) => {
    //         cb(null, { Items: db.wrap([{ test: "test" }]) });
    //     });

    //     const result = await db._findByIndexSingle(db.secondaryIndex[0], "test", {});
    //     expect(result.items).toStrictEqual([{ test: "test" }]);
    // });

    it('Test Dynamodb _getsByIndexSingle with null key', async function () {
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
                        "resource": "*"
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
                    "resource": "*"
                }
            ]
        };
        db.client.scan = jest.fn((params, cb) => {
            cb(null, (mockResult));
        });

        const result = await db._getsByIndexSingle(db.secondaryIndex[0], null, {});
        expect(result.items).toStrictEqual([expectedResult]);
    });

    it('Test Dynamodb _getsByIndexSingle with key not null', async function () {
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
                        "resource": "*"
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
                    "resource": "*"
                }
            ]
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


describe('Dynamodb mocked tests with real function names and no sort key', function () {

    it('Test Dynamodb _getSingle with partition key', async function () {
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
                        "resource": "*"
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
                    "resource": "*"
                }
            ]
        };
        db.client.query = jest.fn((params, cb) => {
            cb(null, mockResult);
        });

        const result = await db.getTransfer("test");
        expect(result.items).toStrictEqual([expectedResult]);
    });

    // it('Test Dynamodb _getSingle failure with no key', async function () {
    //     const configuration = configurationTest.goodSingle;
    //     const db = new Dynamodb(configuration);

    //     expect(db.getTransfer()).toThrow(Error("Invalid parameters for function _getByIndexSingle"));
    // });

});

describe('Dynamodb mocked tests for secondary index with real names', function () {
    const options = {
        scanIndexForward: 1,
        exclusiveStartKey: 1,
        limit: 1
    };

    it('Test Dynamodb _getByIndexSingle with single config', async function () {
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
                        "resource": "*"
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
                    "resource": "*"
                }
            ]
        };
        db.client.query = jest.fn((params, cb) => {
            cb(null, mockResult);
        });

        const result = await db.getTransferByIndexTest1("test");
        expect(result.items).toStrictEqual([expectedResult]);
    });

    it('Test Dynamodb _getByIndexSingle with options', async function () {
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
                        "resource": "*"
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
                    "resource": "*"
                }
            ]
        };
        db.client.query = jest.fn((params, cb) => {
            cb(null, mockResult);
        });

        const result = await db.getTransferByIndexTest1("test", { options });
        expect(result).toStrictEqual([expectedResult]);
    });

    it('Test Dynamodb _getsByIndexSingle with options', async function () {
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
                        "resource": "*"
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
                    "resource": "*"
                }
            ]
        };

        db.client.scan = jest.fn((params, cb) => {
            cb(null, mockResult);
        });

        const result = await db.getTransfersByIndexTest1({ options });
        expect(result.items).toStrictEqual([expectedResult]);
    });

    it('Test Dynamodb _getsByIndexSingle with partition key and options', async function () {
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
                        "resource": "*"
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
                    "resource": "*"
                }
            ]
        };

        db.client.query = jest.fn((params, cb) => {
            cb(null, mockResult);
        });

        const result = await db.getTransfersByIndexTest1("test", { options });
        expect(result.items).toStrictEqual([expectedResult]);
    });

    // it('Test Dynamodb _getsByIndexDual with key not null', async function () {
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

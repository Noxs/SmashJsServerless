const DynamodbConfigBuilder = require('../../helper/dynamodbConfigBuilder');
const DynamodbConfigBuilderData = require('./dynamodbConfigBuilder.data');

describe('DynamodbConfigBuilder with good configs', function () {

    it('Test _isSortKey false', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        expect(dynamodbConfigBuilder._isSortKey("HASH")).toBe(false);
    });

    it('Test _isSortKey false', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        expect(dynamodbConfigBuilder._isSortKey("QDSQSDQSD")).toBe(false);
    });

    it('Test _isSortKey true', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        expect(dynamodbConfigBuilder._isSortKey("RANGE")).toBe(true);
    });

    it('Test _isPartitionKey false', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        expect(dynamodbConfigBuilder._isPartitionKey("QDSQSDQSD")).toBe(false);
    });

    it('Test _isPartitionKey false', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        expect(dynamodbConfigBuilder._isPartitionKey("RANGE")).toBe(false);
    });

    it('Test _isPartitionKey true', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        expect(dynamodbConfigBuilder._isPartitionKey("HASH")).toBe(true);
    });

    it('Test _parseKey success', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        const key = {
            AttributeName: "id",
            KeyType: "HASH"
        };
        const expected_key = { partitionKey: "id" };

        expect(dynamodbConfigBuilder._parseKey(key)).toStrictEqual(expected_key);
    });

    it('Test _parseKey failure', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        const key = {
            AttributeName: "id",
            KeyType: "RANGE"
        };
        const expected_key = { sortKey: "id" };
        expect(dynamodbConfigBuilder._parseKey(key)).toStrictEqual(expected_key);
    });

    it('Test _parseKeySchema failure', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        const key = {
            AttributeName: "id",
            KeyType: "RANGE"
        };
        const expected_key = { sortKey: "id" };
        expect(dynamodbConfigBuilder._parseKey(key)).toStrictEqual(expected_key);
    });


    it('Test _parseKeySchema success', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        const keySchema = DynamodbConfigBuilderData.keySchema_good;
        const expectedParsedKeySchema = DynamodbConfigBuilderData.expectedParsedKeySchema_good;
        expect(dynamodbConfigBuilder._parseKeySchema(keySchema)).toStrictEqual(expectedParsedKeySchema);
    });

    it('Test _parseKeySchema success', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        const keySchema = DynamodbConfigBuilderData.keySchema_good;
        const expectedParsedKeySchema = DynamodbConfigBuilderData.expectedParsedKeySchema_good;
        expect(dynamodbConfigBuilder._parseKeySchema(keySchema)).toStrictEqual(expectedParsedKeySchema);
    });

    it('Test _parsePrimaryIndex success', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        dynamodbConfigBuilder._parsePrimaryIndex();
        expect(dynamodbConfigBuilder.transformedDescription).toStrictEqual(DynamodbConfigBuilderData.expectedParsedPrimaryIndex);
    });

    it('Test _parseSecondaryIndex success', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        dynamodbConfigBuilder._parseSecondaryIndex();
        expect(dynamodbConfigBuilder.transformedDescription).toStrictEqual(DynamodbConfigBuilderData.expectedParsedSecondaryIndex);
    });
    
    it('Test _computeTableName success', function () {
        const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        const computedName = dynamodbConfigBuilder._computeTableName("transfer_transfer_dev");
        expect(computedName).toStrictEqual("Transfer");
    });

    it('Test _translateDescription', function () {
        const description = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
        const expectedResult = {
            "table": "transfer_transfer_dev",
            "name" : "Transfer",
            "primaryIndex": {
                "partitionKey": "id",
                "indexName": "id"
            },
            "secondaryIndex": [
                {
                    "indexName": "account_legacy",
                    "partitionKey": "account_legacy"
                },
                {
                    "indexName": "report",
                    "partitionKey": "report"
                }
            ]
        };
        description._translateDescription();
        expect(description.transformedDescription).toStrictEqual(expectedResult);
    });

    //MORE TESTS TO ADD, WHEN TOO MUCH KEYS IN INDEX FOR EXAMPLE

});

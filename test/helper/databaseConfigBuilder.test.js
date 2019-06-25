const DatabaseConfigBuilder = require('../../helper/databaseConfigBuilder');
const DatabaseConfigBuilderData = require('./databaseConfigBuilder.data');

describe('databaseConfigBuilder with good configs', function () {

    it('Test _isSortKey false', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        expect(databaseConfigBuilder._isSortKey("HASH")).toBe(false);
    });

    it('Test _isSortKey false', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        expect(databaseConfigBuilder._isSortKey("QDSQSDQSD")).toBe(false);
    });

    it('Test _isSortKey true', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        expect(databaseConfigBuilder._isSortKey("RANGE")).toBe(true);
    });

    it('Test _isPartitionKey false', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        expect(databaseConfigBuilder._isPartitionKey("QDSQSDQSD")).toBe(false);
    });

    it('Test _isPartitionKey false', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        expect(databaseConfigBuilder._isPartitionKey("RANGE")).toBe(false);
    });

    it('Test _isPartitionKey true', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        expect(databaseConfigBuilder._isPartitionKey("HASH")).toBe(true);
    });

    it('Test _parseKey success', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        const key = {
            AttributeName: "id",
            KeyType: "HASH"
        };
        const expected_key = { partitionKey: "id" };

        expect(databaseConfigBuilder._parseKey(key)).toStrictEqual(expected_key);
    });

    it('Test _parseKey failure', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        const key = {
            AttributeName: "id",
            KeyType: "RANGE"
        };
        const expected_key = { sortKey: "id" };
        expect(databaseConfigBuilder._parseKey(key)).toStrictEqual(expected_key);
    });

    it('Test _parseKeySchema failure', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        const key = {
            AttributeName: "id",
            KeyType: "RANGE"
        };
        const expected_key = { sortKey: "id" };
        expect(databaseConfigBuilder._parseKey(key)).toStrictEqual(expected_key);
    });


    it('Test _parseKeySchema success', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        const keySchema = DatabaseConfigBuilderData.keySchema_good;
        const expectedParsedKeySchema = DatabaseConfigBuilderData.expectedParsedKeySchema_good;
        expect(databaseConfigBuilder._parseKeySchema(keySchema)).toStrictEqual(expectedParsedKeySchema);
    });

    it('Test _parseKeySchema success', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        const keySchema = DatabaseConfigBuilderData.keySchema_good;
        const expectedParsedKeySchema = DatabaseConfigBuilderData.expectedParsedKeySchema_good;
        expect(databaseConfigBuilder._parseKeySchema(keySchema)).toStrictEqual(expectedParsedKeySchema);
    });

    it('Test _parsePrimaryIndex success', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        databaseConfigBuilder._parsePrimaryIndex();
        expect(databaseConfigBuilder.transformedDescription).toStrictEqual(DatabaseConfigBuilderData.expectedParsedPrimaryIndex);
    });

    it('Test _parseSecondaryIndex success', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        databaseConfigBuilder._parseSecondaryIndex();
        expect(databaseConfigBuilder.transformedDescription).toStrictEqual(DatabaseConfigBuilderData.expectedParsedSecondaryIndex);
    });
    
    it('Test _computeTableName success', function () {
        const databaseConfigBuilder = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
        const computedName = databaseConfigBuilder._computeTableName("transfer_transfer_dev");
        expect(computedName).toStrictEqual("Transfer");
    });

    it('Test _translateDescription', function () {
        const description = new DatabaseConfigBuilder("transfer", "dev", DatabaseConfigBuilderData.good);
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

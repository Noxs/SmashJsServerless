const databaseConfigBuilderData = require('./databaseConfigBuilderData.js');
const DatabaseConfigBuilder = require('../../helper/databaseConfigBuilder.js');

describe('databaseConfigBuilder with good configs', function () {
    it('Test _translateDescription', function () {
        const description = new DatabaseConfigBuilder(databaseConfigBuilderData.good);
        const expectedResult = {
            "table": "Transfer",
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

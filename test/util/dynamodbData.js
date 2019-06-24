module.exports = {
    goodDual: {
        "table": "TableName",
        "name": "name",
        "suffix": "suffix",
        "primaryIndex": {
            "IndexName": "primaryIndex",
            "partitionKey": "partitionKey",
            "sortKey": "sortKey",
        },
        "secondaryIndex": [{
            "IndexName": "IndexTest1",
            "partitionKey": "testIndex1",
            "sortKey": "sortKey2"
        },
        {
            "IndexName": "IndexTest2",
            "partitionKey": "testIndex2",
            "sortKey": "sortKey3"
        }]
    },
    goodSingle: {
        "table": "TableName",
        "name": "name",
        "suffix": "suffix",
        "primaryIndex": {
            "IndexName": "primaryIndex",
            "partitionKey": "partitionKey",
        },
        "secondaryIndex": [{
            "IndexName": "IndexTest1",
            "partitionKey": "testIndex1",
        },
        {
            "IndexName": "IndexTest2",
            "partitionKey": "testIndex2",
        }]
    },
    bad: {
        "table": "TableName",
        "name": "name",
        "suffix": "suffix",
        "primaryIndex": {
            "partitionKey": "partitionKey",
            "sortKey": "sortKey",
        },
        "secondaryIndex": []
    }
}
module.exports = {
	goodDual: {
		"table": "TableName",
		"name": "Transfer",
		"suffix": "suffix",
		"primaryIndex": {
			"indexName": "primaryIndex",
			"partitionKey": "partitionKey",
			"sortKey": "sortKey",
		},
		"secondaryIndex": [
			{
				"indexName": "IndexTest1",
				"partitionKey": "testIndex1",
				"sortKey": "sortKey2",
			},
			{
				"indexName": "IndexTest2",
				"partitionKey": "testIndex2",
				"sortKey": "sortKey3",
			},
		],
	},
	goodSingle: {
		"table": "TableName",
		"name": "Transfer",
		"suffix": "suffix",
		"primaryIndex": {
			"indexName": "primaryIndex",
			"partitionKey": "partitionKey",
		},
		"secondaryIndex": [
			{
				"indexName": "IndexTest1",
				"partitionKey": "testIndex1",
			},
			{
				"indexName": "IndexTest2",
				"partitionKey": "testIndex2",
			},
		],
	},
	bad: {
		"table": "TableName",
		"name": "Transfer",
		"suffix": "suffix",
		"primaryIndex": {
			"partitionKey": "partitionKey",
			"sortKey": "sortKey",
		},
		"secondaryIndex": [],
	},
};

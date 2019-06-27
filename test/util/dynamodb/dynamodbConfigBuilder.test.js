const DynamodbConfigBuilder = require('../../../lib/util/dynamodb/dynamodbConfigBuilder');
const DynamodbConfigBuilderData = require('./dynamodbConfigBuilder.data');

describe('DynamodbConfigBuilder with good configs', () => {
	it('Test _isSortKey false case 1', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		expect(dynamodbConfigBuilder._isSortKey("HASH")).toBe(false);
	});

	it('Test _isSortKey false case 2', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		expect(dynamodbConfigBuilder._isSortKey("QDSQSDQSD")).toBe(false);
	});

	it('Test _isSortKey true', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		expect(dynamodbConfigBuilder._isSortKey("RANGE")).toBe(true);
	});

	it('Test _isPartitionKey false case 1', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		expect(dynamodbConfigBuilder._isPartitionKey("QDSQSDQSD")).toBe(false);
	});

	it('Test _isPartitionKey false case 2', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		expect(dynamodbConfigBuilder._isPartitionKey("RANGE")).toBe(false);
	});

	it('Test _isPartitionKey true', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		expect(dynamodbConfigBuilder._isPartitionKey("HASH")).toBe(true);
	});

	it('Test _parseKey success', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		const key = {
			AttributeName: "id",
			KeyType: "HASH",
		};
		const expectedKey = { partitionKey: "id" };

		expect(dynamodbConfigBuilder._parseKey(key)).toStrictEqual(expectedKey);
	});

	it('Test _parseKey failure', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		const key = {
			AttributeName: "id",
			KeyType: "RANGE",
		};
		const expectedKey = { sortKey: "id" };
		expect(dynamodbConfigBuilder._parseKey(key)).toStrictEqual(expectedKey);
	});

	it('Test _parseKeySchema failure', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		const key = {
			AttributeName: "id",
			KeyType: "RANGE",
		};
		const expectedKey = { sortKey: "id" };
		expect(dynamodbConfigBuilder._parseKey(key)).toStrictEqual(expectedKey);
	});


	it('Test _parseKeySchema success case 1', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		const keySchema = DynamodbConfigBuilderData.keySchema_good;
		const expectedParsedKeySchema = DynamodbConfigBuilderData.expectedParsedKeySchema_good;
		expect(dynamodbConfigBuilder._parseKeySchema(keySchema)).toStrictEqual(expectedParsedKeySchema);
	});

	it('Test _parseKeySchema success case 2', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		const keySchema = DynamodbConfigBuilderData.keySchema_good;
		const expectedParsedKeySchema = DynamodbConfigBuilderData.expectedParsedKeySchema_good;
		expect(dynamodbConfigBuilder._parseKeySchema(keySchema)).toStrictEqual(expectedParsedKeySchema);
	});

	it('Test _parsePrimaryIndex success case 1', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		dynamodbConfigBuilder._parsePrimaryIndex();
		expect(dynamodbConfigBuilder.transformedDescription).toStrictEqual(DynamodbConfigBuilderData.expectedParsedPrimaryIndex);
	});

	it('Test _parsePrimaryIndex success case 2', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good_with_sort_key);
		dynamodbConfigBuilder._parsePrimaryIndex();
		expect(dynamodbConfigBuilder.transformedDescription).toStrictEqual(DynamodbConfigBuilderData.expectedParsedPrimaryIndexWithSortKey);
	});

	it('Test _parseSecondaryIndex success case 1', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		dynamodbConfigBuilder._parseSecondaryIndex();
		expect(dynamodbConfigBuilder.transformedDescription).toStrictEqual(DynamodbConfigBuilderData.expectedParsedSecondaryIndex);
	});

	it('Test _parseSecondaryIndex success case 2', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good_with_sort_key);
		dynamodbConfigBuilder._parseSecondaryIndex();
		expect(dynamodbConfigBuilder.transformedDescription).toStrictEqual(DynamodbConfigBuilderData.expectedParsedSecondaryIndexWithSortKey);
	});

	it('Test _computeTableName success', () => {
		const dynamodbConfigBuilder = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		const computedName = dynamodbConfigBuilder._computeTableName("transfer_transfer_dev");
		expect(computedName).toStrictEqual("Transfer");
	});

	it('Test _transformDescription', () => {
		const description = new DynamodbConfigBuilder("transfer", "dev", DynamodbConfigBuilderData.good);
		const expectedResult = {
			"table": "transfer_transfer_dev",
			"name": "Transfer",
			"primaryIndex": {
				"partitionKey": "id",
				"indexName": "id",
			},
			"secondaryIndex": [
				{
					"indexName": "account_legacy",
					"partitionKey": "account_legacy",
				},
				{
					"indexName": "report",
					"partitionKey": "report",
				},
			],
		};
		description.transformDescription();
		expect(description.transformedDescription).toStrictEqual(expectedResult);
	});
});

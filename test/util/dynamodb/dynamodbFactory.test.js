const DynamodbFactory = require("../../../lib/util/dynamodb/dynamodbFactory");
const DynamodbFactoryData = require("./dynamodbFactory.data");

describe('DynamodbFactory', () => {
	const prefix = 'prefix';
	const suffix = 'suffix';
	const options = {};
	const dynamodbFactory = new DynamodbFactory(prefix, suffix, options);

	it('Test constructor failure case 1', () => {
		expect(() => {
			new DynamodbFactory();
		}).toThrow();
	});

	it('Test constructor failure  case 2', () => {
		expect(() => {
			new DynamodbFactory(1);
		}).toThrow();
	});

	it('Test constructor failure  case 3', () => {
		expect(() => {
			new DynamodbFactory(1, {});
		}).toThrow();
	});

	it('Test constructor failure  case 4', () => {
		expect(() => {
			new DynamodbFactory(1, 1, {});
		}).toThrow();
	});

	it('Test constructor failure case 5', () => {
		expect(() => {
			new DynamodbFactory({});
		}).toThrow();
	});

	it('Test constructor success', () => {
		expect(() => {
			new DynamodbFactory('prefix', 'suffix', {});
		}).not.toThrow();
	});

	it('Test _matchTable failure', () => {
		const tableName = 'suffix_tableName_prefix';
		expect(dynamodbFactory._matchTable(tableName)).toBe(false);
	});

	it('Test _matchTable success case 1', () => {
		const tableName = 'prefix_prefix_tableName_prefix';
		expect(dynamodbFactory._matchTable(tableName)).toBe(false);
	});

	it('Test _matchTable success case 2', () => {
		const tableName = 'prefix_tableName_suffix';
		expect(dynamodbFactory._matchTable(tableName)).toBe(true);
	});

	it('Test _getListTables success', async () => {
		const dynamodbFactory = new DynamodbFactory('prefix', 'suffix', {});
		dynamodbFactory._client.listTables = jest.fn((params, cb) => {
			cb(null, (DynamodbFactoryData.table_names_good));
		});
		const result = await dynamodbFactory._getListTables();
		expect(result).toStrictEqual(DynamodbFactoryData.table_names_good['TableNames']);
	});

	it('Test _getListTables failure case 1', async () => {
		const dynamodbFactory = new DynamodbFactory('prefixx', 'suffix', {});
		dynamodbFactory._client.listTables = jest.fn((params, cb) => {
			cb(null, (DynamodbFactoryData.table_names_good));
		});
		const result = await dynamodbFactory._getListTables();
		expect(result).not.toStrictEqual(DynamodbFactoryData.table_names_good['TableNames']);
	});

	it('Test _getListTables failure case 2', async () => {
		const dynamodbFactory = new DynamodbFactory('prefix', 'suffixx', {});
		dynamodbFactory._client.listTables = jest.fn((params, cb) => {
			cb(null, (DynamodbFactoryData.table_names_good));
		});
		const result = await dynamodbFactory._getListTables();
		expect(result).not.toStrictEqual(DynamodbFactoryData.table_names_good['TableNames']);
	});

	it('Test _getConfigTable success', async () => {
		const dynamodbFactory = new DynamodbFactory('prefix', 'suffix', {});
		dynamodbFactory._client.describeTable = jest.fn((params, cb) => {
			cb(null, (DynamodbFactoryData.description_table_good));
		});
		const result = await dynamodbFactory._getConfigTable();
		expect(result).toStrictEqual(DynamodbFactoryData.description_table_good['Table']);
	});

	it('Test _buildDynamodb success', async () => {
		const dynamodbFactory = new DynamodbFactory('transfer', 'dev', {});
		const config = DynamodbFactoryData.description_table_good;
		const result = await dynamodbFactory._buildDynamodb(config['Table']);
		const tableName = 'Transfer';
		expect(result).toHaveProperty('get' + tableName);
		expect(result).toHaveProperty('delete' + tableName);
		expect(result).toHaveProperty('post' + tableName);
		expect(result).toHaveProperty('put' + tableName);
		expect(result).toHaveProperty('get' + tableName + 's');
	});

	it('Test buildConfigTables success', async () => {
		const dynamodbFactory = new DynamodbFactory('transfer', 'dev', {});
		dynamodbFactory._client.listTables = jest.fn((params, cb) => {
			cb(null, (DynamodbFactoryData.table_names_good));
		});
		dynamodbFactory._client.describeTable = jest.fn((params, cb) => {
			cb(null, (DynamodbFactoryData.description_table_good));
		});
		await dynamodbFactory.buildConfigTables();
		expect(dynamodbFactory._dynamodbs).toHaveLength(3);
	});

});


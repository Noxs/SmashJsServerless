const DynamodbFactory = require("../../lib/util/dynamodbFactory");
const DynamodbFactoryData = require("./dynamodbFactory.data");

describe('DynamodbFactory', function () {
    const prefix = 'prefix';
    const suffix = 'suffix';
    const options = {};
    const dynamodbFactory = new DynamodbFactory(prefix, suffix, options);

    it('Test constructor failure', function () {
        expect(function () {
            const dynamodbFactory = new DynamodbFactory();
        }).toThrow();
    });

    it('Test constructor failure', function () {
        expect(function () {
            const dynamodbFactory = new DynamodbFactory(1);
        }).toThrow();
    });

    it('Test constructor failure', function () {
        expect(function () {
            const dynamodbFactory = new DynamodbFactory(1, {});
        }).toThrow();
    });

    it('Test constructor failure', function () {
        expect(function () {
            const dynamodbFactory = new DynamodbFactory(1, 1, {});
        }).toThrow();
    });

    it('Test constructor failure', function () {
        expect(function () {
            const dynamodbFactory = new DynamodbFactory({});
        }).toThrow();
    });

    it('Test constructor success', function () {
        expect(function () {
            const dynamodbFactory = new DynamodbFactory('prefix', 'suffix', {});
        }).not.toThrow();
    });

    it('Test _matchTable failure', function () {
        const tableName = 'suffix_tableName_prefix';
        expect(dynamodbFactory._matchTable(tableName)).toBe(false);
    });

    it('Test _matchTable success', function () {
        const tableName = 'prefix_prefix_tableName_prefix';
        expect(dynamodbFactory._matchTable(tableName)).toBe(false);
    });

    it('Test _matchTable success', function () {
        const tableName = 'prefix_tableName_suffix';
        expect(dynamodbFactory._matchTable(tableName)).toBe(true);
    });

    it('Test _getListTables success', async function () {
        const dynamodbFactory = new DynamodbFactory('prefix', 'suffix', {});
        dynamodbFactory._client.listTables = jest.fn((params, cb) => {
            cb(null, (DynamodbFactoryData.table_names_good));
        });
        const result = await dynamodbFactory._getListTables();
        expect(result).toStrictEqual(DynamodbFactoryData.table_names_good['TableNames']);
    });

    it('Test _getListTables failure', async function () {
        const dynamodbFactory = new DynamodbFactory('prefixx', 'suffix', {});
        dynamodbFactory._client.listTables = jest.fn((params, cb) => {
            cb(null, (DynamodbFactoryData.table_names_good));
        });
        const result = await dynamodbFactory._getListTables();
        expect(result).not.toStrictEqual(DynamodbFactoryData.table_names_good['TableNames']);
    });

    it('Test _getListTables failure', async function () {
        const dynamodbFactory = new DynamodbFactory('prefix', 'suffixx', {});
        dynamodbFactory._client.listTables = jest.fn((params, cb) => {
            cb(null, (DynamodbFactoryData.table_names_good));
        });
        const result = await dynamodbFactory._getListTables();
        expect(result).not.toStrictEqual(DynamodbFactoryData.table_names_good['TableNames']);
    });

    it('Test _getConfigTable success', async function () {
        const dynamodbFactory = new DynamodbFactory('prefix', 'suffix', {});
        dynamodbFactory._client.describeTable = jest.fn((params, cb) => {
            cb(null, (DynamodbFactoryData.description_table_good));
        });
        const result = await dynamodbFactory._getConfigTable();
        expect(result).toStrictEqual(DynamodbFactoryData.description_table_good['Table']);
    });

    it('Test _buildDynamodb success', async function () {
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

    it('Test buildConfigTables success', async function () {
        const dynamodbFactory = new DynamodbFactory('transfer', 'dev', {});
        dynamodbFactory._client.listTables = jest.fn((params, cb) => {
            cb(null, (DynamodbFactoryData.table_names_good));
        });
        dynamodbFactory._client.describeTable = jest.fn((params, cb) => {
            cb(null, (DynamodbFactoryData.description_table_good));
        });
        await dynamodbFactory.buildConfigTables();
        expect(dynamodbFactory.dynamodbs).toHaveLength(3);
    });

});


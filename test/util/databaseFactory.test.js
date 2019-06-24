const DatabaseFactory = require("../../lib/util/databaseFactory");

describe('DatabaseFactory', function () {
    it('Test smash _getListTables', async function () {
        //TOO REMOVE, MANAGED IN CLOUD FORMATION
        const databaseFactory = new DatabaseFactory(keys, region);
        const tableList = await databaseFactory._getListTables();        
    });

    it('Test smash _getConfigTable', async function () {
        //TOO REMOVE, MANAGED IN CLOUD FORMATION
        const databaseFactory = new DatabaseFactory(keys, region);
        const tableList = await databaseFactory._getConfigTable('transfer_transfer_dev');
    });

    it('Test smash _buildConfigTables', async function () {
        //TOO REMOVE, MANAGED IN CLOUD FORMATION
        const databaseFactory = new DatabaseFactory(keys, region);
        await databaseFactory._buildConfigTables();
    });
    
});


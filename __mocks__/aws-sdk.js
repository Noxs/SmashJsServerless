const MockData = require('./aws-sdk.data');
class DynamoDB {
    constructor() {
    }

    listTables(params, cb) {
        cb(null, MockData.table_names);
    }

    describeTable(params, cb) {
        cb(null, MockData.table_description);
    }
}

module.exports = {
    DynamoDB
};
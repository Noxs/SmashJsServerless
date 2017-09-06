var aws = require('aws-sdk');
var dynamodb = new aws.DynamoDB();
var attr = require('dynamodb-data-types').AttributeValue;
const table = "table_DATABASE_NAME";
const tablePrimary = "table_primary_key";
module.exports = {
    getDATABASE_NAME_UPPERCASE: function (DATABASE_NAME, callback) {
        var params = {
            TableName: table,
            KeyConditionExpression: tablePrimary + " = :id",
            ExpressionAttributeValues: {
                ":id": ""
            }
        };
        params.ExpressionAttributeValues = attr.wrap(params.ExpressionAttributeValues);
        dynamodb.query(params, function (err, data) {
            if (err) {
                console.error("Query on " + params.TableName + ": " + err, err.stack);
                callback(err);
            } else {
                for (var i = 0, length = data.Items.length; i < length; i++) {
                    data.Items[i] = attr.unwrap(data.Items[i]);
                }
                callback(null, data);
            }
        });
    },
    getDATABASE_NAME_UPPERCASEs: function (callback) {
        var results = [];
        var params = {
            "TableName": table
        };
        var loadDataRecusrsive = function (params) {
            dynamodb.scan(params, function (err, data) {
                if (err) {
                    console.error("Scan on " + params.TableName + ": " + err, err.stack);
                    callback("Failed to scan table: " + err);
                } else {
                    for (var i = 0, length = data.Items.length; i < length; i++) {
                        data.Items[i] = attr.unwrap(data.Items[i]);
                        results.push(data.Items[i]);
                    }
                    if (data.LastEvaluatedKey) {
                        params.ExclusiveStartKey = data.LastEvaluatedKey;
                        loadDataRecusrsive(params);
                    } else {
                        callback(null, results);
                    }
                }
            });
        };
        loadDataRecusrsive(params);
    },
    postDATABASE_NAME_UPPERCASE: function (DATABASE_NAME, callback) {
        var params = {
            "TableName": table,
            "Item": attr.wrap(DATABASE_NAME),
            'ConditionExpression': 'attribute_not_exists(' + tablePrimary + ')'
        };
        dynamodb.putItem(params, function (err, data) {
            if (err) {
                console.error("Failed to put item: " + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    putDATABASE_NAME_UPPERCASE: function (DATABASE_NAME, callback) {
        var params = {
            "TableName": table,
            "Item": attr.wrap(DATABASE_NAME)
        };
        dynamodb.putItem(params, function (err, data) {
            if (err) {
                console.error("Failed to put item: " + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    deleteDATABASE_NAME_UPPERCASE: function (DATABASE_NAME, callback) {
        var params = {
            "TableName": table,
            "Key": attr.wrap(DATABASE_NAME)
        };
        dynamodb.deleteItem(params, function (err, data) {
            if (err) {
                console.error("Failed to delete item: " + err);
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    getOutputFilters: function () {
        return [];
    },
    getInputFilters: function () {
        return [];
    }
};
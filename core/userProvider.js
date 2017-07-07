var smash = require("../smash.js");
var aws = require('aws-sdk');
var attr = require('dynamodb-data-types').AttributeValue;

function userProvider() {
    var that = this;
    const confKeyword = "user_provider";
    var next = null;
    var fail = null;
    var conf = null;
    var dynamodb = null;
    var dynamodbTypes = null;
    var queryTable = function (username, callback) {
        if (dynamodb === null) {
            if (conf.region) {
                dynamodb = new aws.DynamoDB({region: conf.region});
            } else {
                dynamodb = new aws.DynamoDB();
            }
        }
        if (dynamodbTypes === null) {
            dynamodbTypes = attr.AttributeValue;
        }
        var params = {
            TableName: conf.dynamodb_table,
            KeyConditionExpression: conf.primary + " = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };
        params.ExpressionAttributeValues = dynamodbTypes.wrap(params.ExpressionAttributeValues);
        dynamodb.query(params, function (err, data) {
            if (err) {
                if (smash.getLogger()) {
                    smash.getLogger().error("Query on " + params.TableName + ": " + err, err.stack);
                }
                callback(err);
            } else {
                for (var i = 0, length = data.Items.length; i < length; i++) {
                    data.Items[i] = dynamodbTypes.unwrap(data.Items[i]);
                }
                callback(null, data);
            }
        });
    };
    var loadUser = function (request, response) {
        queryTable(request.user.username, function (err, data) {
            if (err) {
                response.internalServerError("failed to load user");
                fail(response);
                return false;
            } else {
                if (data.Items.length === 0) {
                    response.forbidden("user not found");
                    fail(response);
                    return false;
                } else {
                    request.user = data.Items[0];
                    next(request, response);
                    return true;
                }
            }
        });
    };
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.setDynamodb = function (extDynamodb) {
        dynamodb = extDynamodb;
        return that;
    };
    that.setDynamodbTypes = function (extDynamodbTypes) {
        dynamodbTypes = extDynamodbTypes;
        return that;
    };
    that.getConfKeyword = function () {
        return confKeyword;
    };
    that.applyConfig = function (extConf) {
        conf = extConf;
        return that;
    };
    that.handleRequest = function (request, response) {
        if (request.user) {
            return loadUser(request, response);
        } else {
            next(request, response);
            return true;
        }
    };
}


smash.registerUserProvider(new userProvider());
module.exports = smash.getUserProvider();

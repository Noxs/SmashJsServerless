var smash = require("../smash.js");
var aws = require('aws-sdk');
var attr = require('dynamodb-data-types').AttributeValue;

var execute = function () {
    var that = this;
    const confKeyword = "user_provider";
    that.next = null;
    that.conf = null;
    that.dynamodb = null;
    that.dynamodbTypes = null;
    that.queryTable = function (username, callback) {
        if (that.dynamodb === null) {
            if (that.conf.region) {
                that.dynamodb = new aws.DynamoDB({region: that.conf.region});
            } else {
                that.dynamodb = new aws.DynamoDB();
            }
        }
        if (that.dynamodbTypes === null) {
            that.dynamodbTypes = attr.AttributeValue;
        }
        var params = {
            TableName: that.conf.dynamodb_table,
            KeyConditionExpression: that.conf.primary + " = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        };
        params.ExpressionAttributeValues = that.dynamodbTypes.wrap(params.ExpressionAttributeValues);
        that.dynamodb.query(params, function (err, data) {
            if (err) {
                if (smash.getLogger()) {
                    smash.getLogger().error("Query on " + params.TableName + ": " + err, err.stack);
                }
                callback(err);
            } else {
                for (var i = 0, length = data.Items.length; i < length; i++) {
                    data.Items[i] = that.dynamodbTypes.unwrap(data.Items[i]);
                }
                callback(null, data);
            }
        });
    };
    that.loadUser = function (request, response) {
        that.queryTable(request.user.username, function (err, data) {
            if (err) {
                response.internalServerError("failed to load user");
            } else {
                if (data.Items.length === 0) {
                    response.forbidden("user not found");
                } else {
                    request.user = data.Items[0];
                    that.next(request, response);
                }
            }
        });
    };
    return {
        setNext: function (next) {
            that.next = next;
        },
        setDynamodb: function (dynamodb) {
            that.dynamodb = dynamodb;
            return that;
        },
        setDynamodbTypes: function (dynamodbTypes) {
            that.dynamodbTypes = dynamodbTypes;
            return that;
        },
        getConfKeyword: function () {
            return confKeyword;
        },
        applyConfig: function (conf) {
            that.conf = conf;
            return that;
        },
        handleRequest: function (request, response) {
            if (request.user) {
                that.loadUser(request, response);
            } else {
                that.next(request, response);
            }
        }
    };

};

var userProvider = execute();
module.exports = userProvider;
smash.registerUserProvider(userProvider);
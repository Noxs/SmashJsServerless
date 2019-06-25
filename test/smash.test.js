const smash = require('../smash.js');
const aws = require('aws-sdk');
const Config = require('../lib/core/config.js');
const cloudWatchEvent = require('./util/cloudWatchEvent.js');
const codePipeline = require('./util/codePipelineJobEvent.js');
const apiGatewayProxyRequest = require('./util/apiGatewayProxyRequest.js');
const DynamodbFactory = require("../lib/util/dynamodbFactory");

const badModule = "badModule";

const overwriteModule = {
    expose: function () {
        return ["foobar", "foorbar"];
    }
};

describe('Smash', function () {
    it('Test smash boot', function () {
        expect(function () {
            smash.boot();
        }).not.toThrow(Error);
    });

    it('Test smash register middleware', function () {
        expect(function () {
            smash.boot();
        }).not.toThrow(Error);
        expect(smash._middlewares).toHaveLength(8);

        smash.boot();
        expect(smash._middlewares).toHaveLength(8);
    });

    it('Test smash register handlers', function () {
        expect(function () {
            smash.boot();
        }).not.toThrow(Error);

        expect(smash._handlers).toHaveLength(5);
    });

    it('Test smash process expose bad module', function () {
        expect(function () {
            smash._processExpose(badModule);
        }).toThrow();

        expect(function () {
            smash._processExpose();
        }).toThrow();
    });

    it('Test smash process expose overwrite module', function () {
        expect(function () {
            smash._processExpose(overwriteModule);
        }).toThrow();
    });

    it('Test smash process expose overwrite module', function () {
        smash._middlewares = null;
        expect(function () {
            smash.handleEvent({});
        }).toThrow();
    });

    it('Test smash util success', function () {
        smash.boot();

        expect(function () {
            smash.util("testUtil");
        }).not.toThrow();
    });

    it('Test smash util not found', function () {
        smash.boot();

        expect(function () {
            smash.util("test");
        }).toThrow();
    });

    it('Test smash util invalid', function () {
        smash.boot();

        expect(function () {
            smash.util(1);
        }).toThrow();
    });

    it('Test smash database success', function () {
        smash.boot();

        // const mockResult = dynamodbFactory_configuration.good;
        // const db = new aws.DynamoDB();
        // db.describeTable = jest.fn((params, cb) => {
        //     cb(null, mockResult);
        // });
        // expect(smash.database("transfer_transfer")).not.toThrow();
    });

    it('Test smash database found', async function () {
        smash.boot();
        const dynamodbFactory = new DynamodbFactory(keys, region);
        await dynamodbFactory._buildConfigTables();
        console.log(dynamodbFactory._dynamodbs);
        smash.database('transfer_transfer');
        expect(function () {
            smash.database("test");
        }).toThrow();
    });

    it('Test smash database invalid', function () {
        smash.boot();

        expect(function () {
            smash.database(1);
        }).toThrow();
    });

    it('Test smash helper success', function () {
        smash.boot();

        expect(function () {
            smash.helper("random");
        }).not.toThrow();
    });

    it('Test smash helper not found', function () {
        smash.boot();

        expect(function () {
            smash.helper("test");
        }).toThrow();
    });

    it('Test smash helper invalid', function () {
        smash.boot();

        expect(function () {
            smash.helper(1);
        }).toThrow();
    });

    it('Test smash config', function () {
        smash.boot();
        expect(typeof smash.config).toBe('object');
        expect(smash.config).toBeInstanceOf(Config);
    });

    it('Test smash model', function () {
        smash.boot();
        expect(typeof smash.DynamodbModel).toBe('function');
    });

    it('Test smash console', function () {
        smash.boot();
        expect(typeof smash.Console).toBe('function');;
    });

    it('Test smash handle event cloud watch event success', function () {
        smash.boot();
        const event = cloudWatchEvent.good;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = jest.fn((error, data) => {
            expect(error).toBeNull();
        });

        smash.handleEvent(event, context, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('Test smash handle event cloud watch event not found', function () {
        smash.boot();
        const event = cloudWatchEvent.bad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = jest.fn((error, data) => {
            expect(error).not.toBeNull();
        });
        smash.handleEvent(event, context, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('Test smash handle event codepipeline event success', function () {
        smash.boot();
        const event = codePipeline.goodgood;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = jest.fn((error, data) => {
            expect(error).toBeNull();
        });
        smash.handleEvent(event, context, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('Test smash handle event codepipeline event not found', function () {
        smash.boot();
        const event = codePipeline.bad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = jest.fn((error, data) => {
            expect(error).not.toBeNull();
        });
        smash.handleEvent(event, context, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('Test smash handle event api gateway proxy event success', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.goodWithoutUser;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = jest.fn((error, data) => {
            expect(error).toBeNull();
            expect(typeof data).toBe('object');
            expect(data).toStrictEqual({
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
                },
                body: '{"data":{"foo":"bar"}}'
            });
        });
        smash.handleEvent(event, context, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('Test smash handle event api gateway proxy event not found', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.goodNotFound;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = jest.fn((error, data) => {
            expect(error).toBeNull();
            expect(typeof data).toBe('object');
            expect(data).toStrictEqual({
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
                },
                body: '{"code":404,"error":"Route GET /notfound not found","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef"}',
            });
        });
        smash.handleEvent(event, context, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('Test smash handle event api gateway proxy event incorrect', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.bad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = jest.fn((error, data) => {
            expect(error).toBeNull();
            expect(typeof data).toBe('object');

            expect(data).toStrictEqual({
                statusCode: 500,
                body: '{"code":500,"error":"Internal Server Error","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef"}',
                headers: {
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
                },
            });
        });
        smash.handleEvent(event, context, callback);
        expect(callback).toHaveBeenCalled();
    });

    it('Test smash handle event api gateway proxy event incorrect', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.badbad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = function (error, data) {
            expect(data).toBeUndefined();
            expect(error.message).toStrictEqual("No middleware found to process event");
        };
        smash.handleEvent(event, context, callback);
    });

    it('Test smash getRoutes', function () {
        smash.shutdown();
        expect(smash.getRoutes()).toThrow(Error);
        smash.boot();
        expect(Array.isArray(smash.getRoutes())).toBe(true);
    });

    it('Test smash getHandlers', function () {
        smash.boot();
        expect(Array.isArray(smash.getHandlers())).toBe(true);
    });
});

const smash = require('../smash');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Config = require('../lib/core/config');
const DynamodbModel = require('../lib/util/dynamodbModel');
const Console = require('../lib/util/console');
const cloudWatchEvent = require('./util/cloudWatchEvent');
const codePipeline = require('./util/codePipelineJobEvent');
const apiGatewayProxyRequest = require('./util/apiGatewayProxyRequest');

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
        }).to.not.throw(Error);
    });

    it('Test smash register middleware', function () {
        expect(function () {
            smash.boot();
        }).to.not.throw(Error);
        assert.lengthOf(smash._middlewares, 9);

        smash.boot();
        assert.lengthOf(smash._middlewares, 9);
    });

    it('Test smash register handlers', function () {
        expect(function () {
            smash.boot();
        }).to.not.throw(Error);

        assert.lengthOf(smash._handlers, 5);
    });

    it('Test smash process expose bad module', function () {
        expect(function () {
            smash._processExpose(badModule);
        }).to.throw(Error);

        expect(function () {
            smash._processExpose();
        }).to.throw(Error);
    });
    /* 
        it('Test smash process expose overwrite module', function () {
            expect(function () {
                smash._processExpose(overwriteModule);
            }).to.throw(Error);
        }); */

    it('Test smash process expose overwrite module', function () {
        smash._middlewares = null;
        expect(function () {
            smash.handleEvent({});
        }).to.throw(Error);
    });

    it('Test smash util success', function () {
        smash.boot();

        expect(function () {
            smash.util("testUtil");
        }).to.not.throw(Error);
    });

    it('Test smash util not found', function () {
        smash.boot();

        expect(function () {
            smash.util("test");
        }).to.throw(Error);
    });

    it('Test smash util invalid', function () {
        smash.boot();

        expect(function () {
            smash.util(1);
        }).to.throw(Error);
    });

    it('Test smash database success', function () {
        smash.boot();

        expect(function () {
            smash.database("testDatabase");
        }).to.not.throw(Error);
    });

    it('Test smash database not found', function () {
        smash.boot();

        expect(function () {
            smash.database("test");
        }).to.throw(Error);
    });

    it('Test smash database invalid', function () {
        smash.boot();

        expect(function () {
            smash.database(1);
        }).to.throw(Error);
    });

    it('Test smash helper success', function () {
        smash.boot();

        expect(function () {
            smash.helper("random");
        }).to.not.throw(Error);
    });

    it('Test smash helper not found', function () {
        smash.boot();

        expect(function () {
            smash.helper("test");
        }).to.throw(Error);
    });

    it('Test smash helper invalid', function () {
        smash.boot();

        expect(function () {
            smash.helper(1);
        }).to.throw(Error);
    });

    it('Test smash config', function () {
        smash.boot();
        assert.isObject(smash.config);
        assert.instanceOf(smash.config, Config);
    });

    it('Test smash model', function () {
        smash.boot();
        assert.isFunction(smash.DynamodbModel);
    });

    it('Test smash console', function () {
        smash.boot();
        assert.isFunction(smash.Console);
    });

    it('Test smash handle event cloud watch event success', function () {
        smash.boot();
        const event = cloudWatchEvent.good;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const spy = sinon.spy();
        const callback = function (error, data) {
            assert.isNull(error);
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });

    it('Test smash handle event cloud watch event not found', function () {
        smash.boot();
        const event = cloudWatchEvent.bad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const spy = sinon.spy();
        const callback = function (error, data) {
            assert.isNotNull(error);
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });

    it('Test smash handle event codepipeline event success', function () {
        smash.boot();
        const event = codePipeline.goodgood;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const spy = sinon.spy();
        const callback = function (error, data) {
            assert.isNull(error);
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });

    it('Test smash handle event codepipeline event not found', function () {
        smash.boot();
        const event = codePipeline.bad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const spy = sinon.spy();
        const callback = function (error, data) {
            assert.isNotNull(error);
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });

    it('Test smash handle event api gateway proxy event success', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.goodWithoutUser;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const spy = sinon.spy();
        const callback = function (error, data) {
            assert.isNull(error);
            assert.isObject(data);
            assert.deepEqual({
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
                },
                body: '{"data":{"foo":"bar"}}'
            }, data);
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });

    it('Test smash handle event api gateway proxy event not found', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.goodNotFound;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const spy = sinon.spy();
        const callback = function (error, data) {
            assert.isNull(error);
            assert.isObject(data);
            assert.deepEqual({
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
                },
                body: '{"code":404,"error":"Route GET /notfound not found","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef"}',
            }, data);
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });

    it('Test smash handle event api gateway proxy event incorrect', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.bad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = function (error, data) {
            assert.isNull(error);
            assert.isObject(data);
            assert.deepEqual({
                statusCode: 500,
                body: '{"code":500,"error":"Internal Server Error","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef"}',
                headers: {
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
                },
            }, data);
        };
        smash.handleEvent(event, context, callback);
    });

    it('Test smash handle event api gateway proxy event incorrect', function () {
        smash.boot();
        const event = apiGatewayProxyRequest.badbad;
        const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
        const callback = function (error, data) {
            assert.isUndefined(data);
            assert.deepEqual(error.message, "No middleware found to process event");
        };
        smash.handleEvent(event, context, callback);
    });

    it('Test smash getRoutes', function () {
        smash.shutdown();
        expect(function () {
            smash.getRoutes();
        }).to.throw(Error);
        smash.boot();
        expect(function () {
            assert.isArray(smash.getRoutes());
        }).to.not.throw(Error);
    });

    it('Test smash getHandlers', function () {
        smash.boot();
        expect(function () {
            assert.isArray(smash.getHandlers());
        }).to.not.throw(Error);
    });
});

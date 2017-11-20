require('../smash.js');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Config = require('../lib/core/config.js');
const Model = require('../lib/util/model.js');
const Console = require('../lib/util/console.js');
const cloudWatchEvent = require('./util/cloudWatchEvent.js');
const apiGatewayProxyRequest = require('./util/apiGatewayProxyRequest.js');

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
        assert.lengthOf(smash._middlewares, 2);

        smash.boot();
        assert.lengthOf(smash._middlewares, 2);
    });

    it('Test smash register handlers', function () {
        expect(function () {
            smash.boot();
        }).to.not.throw(Error);

        assert.lengthOf(smash._handlers, 3);
    });

    it('Test smash env', function () {
        smash.boot();
        expect(function () {
            smash._buildEnv({functionVersion: "prod"});
        }).to.not.throw(Error);
        assert.equal(smash.getEnv("ENV"), "prod");
    });

    it('Test smash util success', function () {
        smash.boot();

        expect(function () {
            smash.util("testUtil");
        }).to.not.throw(Error);
    });

    it('Test smash util failure', function () {
        smash.boot();

        expect(function () {
            smash.util("test");
        }).to.throw(Error);
    });

    it('Test smash database success', function () {
        smash.boot();

        expect(function () {
            smash.database("testDatabase");
        }).to.not.throw(Error);
    });

    it('Test smash database failure', function () {
        smash.boot();

        expect(function () {
            smash.database("test");
        }).to.throw(Error);
    });

    it('Test smash config', function () {
        smash.boot();
        assert.isObject(smash.config);
        assert.instanceOf(smash.config, Config);
    });

    it('Test smash model', function () {
        smash.boot();
        assert.isFunction(smash.model);
    });

    it('Test smash console', function () {
        smash.boot();
        assert.isFunction(smash.console);
    });

    it('Test smash handle event cloud watch event', function () {
        smash.boot();
        const event = cloudWatchEvent;
        const context = {functionVersion: "prod"};
        const spy = sinon.spy();
        const callback = function () {
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });

    it('Test smash handle event api gateway proxy event', function () {
        smash.boot();
        const event = apiGatewayProxyRequest;
        const context = {functionVersion: "prod"};
        const spy = sinon.spy();
        const callback = function () {
            spy.call();
        };
        smash.handleEvent(event, context, callback);
        assert.ok(spy.called);
    });
});

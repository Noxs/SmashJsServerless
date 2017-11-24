const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Console = require('../lib/util/console.js');

describe('Console', function () {
    it('Test console instance', function () {
        const console = new Console();
        assert.isObject(console);
    });

    it('Test console log function', function () {
        const console = new Console();
        assert.isFunction(console.log);
    });

    it('Test console info function', function () {
        const console = new Console();
        assert.isFunction(console.info);
    });

    it('Test console warn function', function () {
        const console = new Console();
        assert.isFunction(console.warn);
    });

    it('Test console error function', function () {
        const console = new Console();
        assert.isFunction(console.error);
    });

    it('Test console codes', function () {
        const console = new Console();
        const codes = {
            badRequest: 400,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
            conflict: 409,
            internalServerError: 500,
            notImplemented: 501,
            serviceUnavailable: 502
        };
        assert.deepEqual(codes, console.codes);
        assert.isFrozen(console.codes);
    });

    it('Test console buildError()', function () {
        const console = new Console();

        expect(function () {
            const error = console.buildError("test", 500);
        }).to.not.throw(Error);

        expect(function () {
            const error = console.buildError();
        }).to.not.throw(Error);

        expect(function () {
            const error = console.buildError("test");
        }).to.not.throw(Error);

        expect(function () {
            const error = console.buildError(null, 200);
        }).to.not.throw(Error);

        const error = console.buildError("test", 500);
        assert.equal(error.constructor, Error);
    });
});

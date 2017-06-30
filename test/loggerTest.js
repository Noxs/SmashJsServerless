var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var logger = require('../core/logger.js');
var currentArgment = null;
var consoleMock = {
    log: function () {
        currentArgment = arguments;
    },
    warn: function () {
        currentArgment = arguments;
    },
    error: function () {
        currentArgment = arguments;
    }
};
describe('Logger', function () {
    it('Test logger instance', function () {
        assert.isObject(logger);
        assert.isFunction(logger.log);
        assert.isFunction(logger.warn);
        assert.isFunction(logger.error);
    });
    it('Test logger accessor', function () {
        assert.equal(logger.getConsole(), console);
        logger.setConsole(consoleMock);
        assert.equal(logger.getConsole(), consoleMock);
    });
    it('Test logger function', function () {
        logger.log('test');
        assert.equal('test', currentArgment['0']);
        logger.warn("test", "test1");
        assert.equal('test', currentArgment['0']);
        assert.equal('test1', currentArgment['1']);
        logger.error("test", "test1", "test2");
        assert.equal('test', currentArgment['0']);
        assert.equal('test1', currentArgment['1']);
        assert.equal('test2', currentArgment['2']);
    });
});

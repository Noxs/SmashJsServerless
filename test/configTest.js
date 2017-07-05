var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var config = require('../core/config.js');
describe('Config', function () {
    it('Test config instance', function () {
        assert.isObject(config);
    });
    it('Test config load', function () {
        expect(() => config.load("/wrongPath")).to.not.throw();
        expect(() => config.load("./")).to.not.throw();
        expect(config.load).to.throw(Error);
    });
});

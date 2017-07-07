var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var config = require('../core/config.js');
var dynamodb_config = {
    dynamodb_table: 'test_table',
    region: 'eu-west-1',
    primary: 'username'
};
describe('Config', function () {
    it('Test config instance', function () {
        assert.isObject(config);
    });
    it('Test config load', function () {
        expect(() => config.load("/wrongPath")).to.not.throw();
        expect(() => config.load("./")).to.not.throw();
        expect(config.load).to.throw(Error);
    });
    it('Test config value access', function () {
        expect(() => config.load("./")).to.not.throw();
        var data = config.get("user_provider");
        assert.deepEqual(data, dynamodb_config);
    });
});

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var requestFactory = require('../core/request.js');
describe('Request', function () {
    it('Test request instance', function () {
        assert.isObject(requestFactory);
        assert.isFunction(requestFactory.createRequest);
        var request = requestFactory.createRequest();
        assert.isObject(request);
    });
});

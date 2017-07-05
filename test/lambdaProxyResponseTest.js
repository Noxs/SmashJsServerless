var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var lambdaProxyResponse = require('../middleware/lambdaProxyResponse.js');
function createResponse() {
    return {
        code: 200,
        headers: {},
        body: null
    };
}
function createNext() {
    return sinon.spy();
}
describe('LambdaProxyResponse', function () {
    it('Test lambda proxy response instance', function () {
        assert.isObject(lambdaProxyResponse);
    });
    it('Test lambda proxy response handle request', function () {
        var response = createResponse();
        lambdaProxyResponse.setNext(function (error, formattedResponse) {
            assert.isNull(error);
            assert.isObject(formattedResponse);
            assert.equal(formattedResponse.code, response.code);
            assert.equal(formattedResponse.headers, response.headers);
            assert.equal(formattedResponse.body, response.body);
        });
        assert.isTrue(lambdaProxyResponse.handleResponse(response));

        response.body = {"test": "test"};
        lambdaProxyResponse.setNext(function (error, formattedResponse) {
            assert.isNull(error);
            assert.isObject(formattedResponse);
            assert.equal(formattedResponse.code, response.code);
            assert.equal(formattedResponse.headers, response.headers);
            assert.equal(formattedResponse.body, JSON.stringify(response.body));
        });
        assert.isTrue(lambdaProxyResponse.handleResponse(response));
    });
});

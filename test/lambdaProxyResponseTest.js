var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var lambdaProxyResponse = require('../middleware/lambdaProxyResponse.js');
function createResponse() {
    var that = this;
    var code = null;
    var headers = {};
    var body = null;
    that.getCode = function () {
        return code;
    };
    that.setCode = function (extCode) {
        code = extCode;
        return that;
    };
    that.getHeaders = function () {
        return headers;
    };
    that.setHeaders = function (extHeaders) {
        headers = extHeaders;
        return that;
    };
    that.getBody = function () {
        return body;
    };
    that.setBody = function (extBody) {
        body = extBody;
        return that;
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
        var response = new createResponse();
        lambdaProxyResponse.setNext(function (error, formattedResponse) {
            assert.isNull(error);
            assert.isObject(formattedResponse);
            assert.equal(formattedResponse.code, response.getCode());
            assert.equal(formattedResponse.headers, response.getHeaders());
            assert.equal(formattedResponse.body, response.getBody());
        });
        assert.isTrue(lambdaProxyResponse.handleResponse(response));
        response.setBody({"test": "test"});
        lambdaProxyResponse.setNext(function (error, formattedResponse) {
            assert.isNull(error);
            assert.isObject(formattedResponse);
            assert.equal(formattedResponse.code, response.getCode());
            assert.equal(formattedResponse.headers, response.getHeaders());
            assert.equal(formattedResponse.body, JSON.stringify(response.getBody()));
        });
        assert.isTrue(lambdaProxyResponse.handleResponse(response));
    });
});

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var responseFactory = require('../core/response.js');
function createNext() {
    return sinon.spy();
}
describe('Response', function () {
    it('Test response instance', function () {
        assert.isObject(responseFactory);
        assert.isFunction(responseFactory.createResponse);
        var response = responseFactory.createResponse();
        assert.isObject(response);
    });
    it('Test response code', function () {
        var response = responseFactory.createResponse();
        response.noContent();
        assert.equal(response.getCode(), 204);
    });
    it('Test response header', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
    });
    it('Test response body', function () {
        var response = responseFactory.createResponse();
        response.setBody("blabla");
        assert.deepEqual(response.getBody(), "blabla");
    });
    it('Test response ok', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.ok({"content": "ok"});
        assert.equal(response.getCode(), 200);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.deepEqual(response.getBody(), {"content": "ok"});

        var response = responseFactory.createResponse();
        response.ok({"content": "ok"});
        assert.equal(response.getCode(), 200);
        assert.deepEqual(response.getBody(), {"content": "ok"});
    });
    it('Test response created', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.created({"content": "ok"});
        assert.equal(response.getCode(), 201);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.deepEqual(response.getBody(), {"content": "ok"});
    });
    it('Test response no content', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.noContent();
        assert.equal(response.getCode(), 204);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response bad request', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.badRequest();
        assert.equal(response.getCode(), 400);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response unauthorized', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.unauthorized();
        assert.equal(response.getCode(), 401);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response forbidden', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.forbidden();
        assert.equal(response.getCode(), 403);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response not found', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.notFound();
        assert.equal(response.getCode(), 404);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response conflict', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.conflict();
        assert.equal(response.getCode(), 409);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response internal server error', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.internalServerError();
        assert.equal(response.getCode(), 500);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response not implemented', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.notImplemented();
        assert.equal(response.getCode(), 501);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response service unavailable', function () {
        var response = responseFactory.createResponse();
        response.addHeader("Content-Type", "application/json");
        response.serviceUnavailable();
        assert.equal(response.getCode(), 503);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
}
);



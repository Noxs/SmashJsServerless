var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var responseFactory = require('../core/response.js');
function createNext() {
    return sinon.spy();
}
function createTerminate() {
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
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.noContent();
        assert.isOk(terminate.called);
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
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.ok({"content": "ok"});
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 200);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.deepEqual(response.getBody(), {"content": "ok"});

        terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.ok({"content": "ok"});
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 200);
        assert.deepEqual(response.getBody(), {"content": "ok"});
    });
    it('Test response created', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.created({"content": "ok"});
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 201);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.deepEqual(response.getBody(), {"content": "ok"});
    });
    it('Test response no content', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.noContent();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 204);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response bad request', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.badRequest();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 400);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response unauthorized', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.unauthorized();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 401);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response forbidden', function () {
        var terminate = createTerminate(terminate);
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.forbidden();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 403);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response not found', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.notFound();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 404);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response conflict', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.conflict();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 409);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response internal server error', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.internalServerError();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 500);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response not implemented', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.notImplemented();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 501);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
    it('Test response service unavailable', function () {
        var terminate = createTerminate();
        var response = responseFactory.createResponse(terminate);
        response.addHeader("Content-Type", "application/json");
        response.serviceUnavailable();
        assert.isOk(terminate.called);
        assert.equal(response.getCode(), 503);
        assert.deepEqual(response.getHeaders(), {"Content-Type": "application/json"});
        assert.isNull(response.getBody());
    });
}
);



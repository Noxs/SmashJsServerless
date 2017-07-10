var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var authorization = require('../core/authorization.js').build();
var conf = {
    "roles": {
        "ROLE_USER": {
        },
        "ROLE_ADMIN": {
            "childrens": [
                "ROLE_USER"
            ]
        },
        "ROLE_SUPER_ADMIN": {
            "childrens": [
                "ROLE_ADMIN"
            ]
        }
    }
};
var route = {
    authorizations: null
};
var request = {
    user: null,
    route: {}
};
function createNext() {
    return sinon.spy();
}
function createFail() {
    return sinon.spy();
}
function createResponse() {
    return {
        forbidden: sinon.spy()
    };
}
describe('Authorization', function () {
    it('Test authorization instance', function () {
        assert.isObject(authorization);
    });
    it('Test conf keyword', function () {
        assert.equal(authorization.getConfKeyword(), "authorization");
    });
    it('Test apply config', function () {
        assert.isFunction(authorization.applyConfig);
        expect(() => authorization.applyConfig(conf)).to.not.throw();
    });
    it('Test handle request', function () {
        var next = createNext();
        var fail = createFail();
        var response = createResponse();
        request.user = null;
        request.route.authorizations = null;
        authorization.setNext(function (request, response) {
            assert.isObject(request);
            assert.equal(request, request);
        }, fail);
        assert.isOk(fail.notCalled);
        assert.isTrue(authorization.handleRequest(request, response));

        request.user = null;
        request.route.authorizations = ["ROLE_USER"];
        response = createResponse();
        next = createNext();
        fail = createFail();
        authorization.setNext(next, fail);
        assert.isFalse(authorization.handleRequest(request, response));
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);
        assert.isOk(response.forbidden.called);

        request.user = null;
        request.route.authorizations = ["ROLE_TROLL"];
        response = createResponse();
        next = createNext();
        fail = createFail();
        authorization.setNext(next, fail);
        assert.isFalse(authorization.handleRequest(request, response));
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);
        assert.isOk(response.forbidden.called);

        request.user = {roles: ["ROLE_TROLL"]};
        request.route.authorizations = ["ROLE_USER"];
        response = createResponse();
        next = createNext();
        fail = createFail();
        authorization.setNext(next, fail);
        assert.isFalse(authorization.handleRequest(request, response));
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);
        assert.isOk(response.forbidden.called);

        //TODO
        //not sure if this is how it should process the request
        //maybe add a security in the register method config
        request.user = {roles: ["ROLE_TROLL"]};
        request.route.authorizations = ["ROLE_TROLL"];
        response = createResponse();
        next = createNext();
        fail = createFail();
        authorization.setNext(next, fail);
        assert.isFalse(authorization.handleRequest(request, response));
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);
        assert.isOk(response.forbidden.called);


        fail = createFail();
        request.user = {roles: ["ROLE_USER"]};
        request.route.authorizations = ["ROLE_USER"];
        authorization.setNext(function (request, response) {
            assert.isObject(request);
            assert.equal(request, request);
        }, fail);
        assert.isOk(fail.notCalled);
        assert.isTrue(authorization.handleRequest(request, response));

        fail = createFail();
        request.user = {roles: ["ROLE_USER", "ROLE_ADMIN"]};
        request.route.authorizations = ["ROLE_USER"];
        authorization.setNext(function (request, response) {
            assert.isObject(request);
            assert.equal(request, request);
        }, fail);
        assert.isOk(fail.notCalled);
        assert.isTrue(authorization.handleRequest(request, response));

        fail = createFail();
        request.user = {roles: ["ROLE_USER", "ROLE_ADMIN"]};
        request.route.authorizations = ["ROLE_USER", "ROLE_ADMIN"];
        authorization.setNext(function (request, response) {
            assert.isObject(request);
            assert.equal(request, request);
        }, fail);
        assert.isOk(fail.notCalled);
        assert.isTrue(authorization.handleRequest(request, response));

        fail = createFail();
        request.user = {roles: ["ROLE_USER"]};
        request.route.authorizations = ["ROLE_USER", "ROLE_ADMIN"];
        authorization.setNext(function (request, response) {
            assert.isObject(request);
            assert.equal(request, request);
        }, fail);
        assert.isOk(fail.notCalled);
        assert.isTrue(authorization.handleRequest(request, response));

        request.user = {roles: ["ROLE_USER"]};
        request.route.authorizations = ["ROLE_ADMIN"];
        response = createResponse();
        next = createNext();
        fail = createFail();
        assert.isOk(fail.notCalled);
        authorization.setNext(next, fail);
        assert.isFalse(authorization.handleRequest(request, response));
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);
        assert.isOk(response.forbidden.called);

        fail = createFail();
        request.user = {roles: ["ROLE_ADMIN"]};
        request.route.authorizations = ["ROLE_USER"];
        authorization.setNext(function (request, response) {
            assert.isObject(request);
            assert.equal(request, request);
        }, fail);
        assert.isOk(fail.notCalled);
        assert.isTrue(authorization.handleRequest(request, response));

    });
});

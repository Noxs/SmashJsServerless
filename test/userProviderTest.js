var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var userProvider = require('../core/userProvider.js').build();
var smash = require('../smash.js');
var dynamodbTypes = {
    wrap: sinon.spy(),
    unwrap: function () {
        return {
            "username": "test@test.com",
            "roles": ["ROLE_USER"]
        }
    }
};
var dynamodbSuccess = {
    query: function (params, callback) {
        var err = null;
        var result = {
            Items: [{
                    "username": "test@test.com",
                    "roles": ["ROLE_USER"]
                }]
        };
        callback(err, result);
    }
};
var dynamodbNotFound = {
    query: function (params, callback) {
        var err = null;
        var result = {
            Items: []
        };
        callback(err, result);
    }
};
var dynamodbFailed = {
    query: function (params, callback) {
        var err = new Error;
        var result = {};
        callback(err, result);
    }
};
var conf = {
    "dynamodb_table": "test_table",
    "region": "eu-west-1",
    "primary": "username"
};
var request = {
    user: null
};
function createResponse() {
    return {
        internalServerError: sinon.spy(),
        forbidden: sinon.spy()
    };
}
function createNext() {
    return sinon.spy();
}
function createFail() {
    return sinon.spy();
}
function createLogger() {
    return {
        error: sinon.spy()
    };
}
describe('UserProvider', function () {
    it('Test userProvider instance', function () {
        assert.isObject(userProvider);
    });
    it('Test conf keyword', function () {
        assert.equal(userProvider.getConfKeyword(), "user_provider");
    });
    it('Test set next', function () {
        expect(() => userProvider.setNext(createNext())).to.not.throw();
    });
    it('Test apply config', function () {
        assert.isFunction(userProvider.applyConfig);
        expect(() => userProvider.applyConfig(conf)).to.not.throw();
    });
    it('Test handle request', function () {
        var logger = createLogger();
        smash.boot(false);
        smash.registerLogger(logger);
        userProvider.setDynamodbTypes(dynamodbTypes);
        var next = createNext();
        var fail = createFail();
        var response = createResponse();
        userProvider.setDynamodb(dynamodbFailed);
        userProvider.setNext(next, fail);
        userProvider.handleRequest(request, response);
        assert.isOk(next.called);
        assert.isOk(response.internalServerError.notCalled);
        assert.isOk(response.forbidden.notCalled);
        assert.isOk(fail.notCalled);

        next = createNext();
        fail = createFail();
        response = createResponse();
        request.user = {};
        request.user.username = "test@test.com";
        userProvider.setDynamodb(dynamodbFailed);
        userProvider.setNext(next, fail);
        userProvider.handleRequest(request, response);
        assert.isOk(next.notCalled);
        assert.isOk(response.internalServerError.called);
        assert.isOk(response.forbidden.notCalled);
        assert.isOk(fail.called);


        next = createNext();
        fail = createFail();
        response = createResponse();
        request.user = {};
        request.user.username = "test@test.com";
        userProvider.setDynamodb(dynamodbNotFound);
        userProvider.setNext(next, fail);
        userProvider.handleRequest(request, response);
        assert.isOk(next.notCalled);
        assert.isOk(response.internalServerError.notCalled);
        assert.isOk(response.forbidden.called);
        assert.isOk(fail.called);

        next = createNext();
        fail = createFail();
        response = createResponse();
        request.user = {};
        request.user.username = "test@test.com";
        userProvider.setDynamodb(dynamodbSuccess);
        userProvider.setNext(next, fail);
        userProvider.handleRequest(request, response);
        assert.isOk(next.called);
        assert.isOk(response.internalServerError.notCalled);
        assert.isOk(response.forbidden.notCalled);
        assert.isOk(fail.notCalled);
    });
});

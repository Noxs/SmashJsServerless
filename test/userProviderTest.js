const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const UserProvider = require('../lib/core/userProvider.js');
const Request = require('../lib/core/request.js');
const Response = require('../lib/core/response.js');

class User {

}

class EmptyRepository {

}

class BadFunctionRepository {
    loadUser() {
        return {
            then() {

            }
        };
    }
}

class Repository {
    loadUser(username) {
        return {
            then() {

            }
        };
    }
}

class RepositorySuccess {
    loadUser(username) {
        return {
            then(success, failure) {
                success(new User());
            }
        };
    }
}

class RepositoryNotFound {
    loadUser(username) {
        return {
            then(success, failure) {
                success(null);
            }
        };
    }
}

class RepositoryFailure {
    loadUser(username) {
        return {
            then(success, failure) {
                failure(new Error());
            }
        };
    }
}

describe('UserProvider', function () {
    it('Test instance', function () {
        const userProvider = new UserProvider();
        assert.isObject(userProvider);
    });

    it('Test bad repository', function () {
        const userProvider = new UserProvider();
        const badRepository = "repository";

        expect(function () {
            userProvider.attachRepository(badRepository);
        }).to.throw(Error);
    });

    it('Test empty repository', function () {
        const userProvider = new UserProvider();
        const emptyRepository = new EmptyRepository();

        expect(function () {
            userProvider.attachRepository(emptyRepository);
        }).to.throw(Error);
    });

    it('Test bad function repository', function () {
        const userProvider = new UserProvider();
        const badFunctionRepository = new BadFunctionRepository();

        expect(function () {
            userProvider.attachRepository(badFunctionRepository);
        }).to.throw(Error);
    });

    it('Test bad function repository', function () {
        const userProvider = new UserProvider();
        const repository = new Repository();

        expect(function () {
            userProvider.attachRepository(repository);
        }).to.not.throw(Error);

        assert.equal(userProvider._repository, repository);
    });

    it('Test handle request without repository', function () {
        const userProvider = new UserProvider();
        const request = new Request();
        const response = new Response((parameter) => {
        });

        expect(function () {
            userProvider.handleRequest();
        }).to.throw(Error);

        expect(function () {
            userProvider.handleRequest(request);
        }).to.throw(Error);

        expect(function () {
            userProvider.handleRequest(request, response);
        }).to.throw(Error);

        expect(function () {
            userProvider.handleRequest(null, response);
        }).to.throw(Error);
    });

    it('Test handle request without good parameters', function () {
        const userProvider = new UserProvider();
        const repository = new Repository();
        const request = new Request();
        const response = new Response((parameter) => {
        });

        userProvider.attachRepository(repository);

        expect(function () {
            userProvider.handleRequest();
        }).to.throw(Error);

        expect(function () {
            userProvider.handleRequest(request);
        }).to.throw(Error);

        expect(function () {
            userProvider.handleRequest(request, response);
        }).to.throw(Error);

        expect(function () {
            userProvider.handleRequest(null, response);
        }).to.throw(Error);
    });

    it('Test userProvider handle request without repository', function () {
        const userProvider = new UserProvider();
        const request = new Request();
        const spyNext = sinon.spy();
        const spyFail = sinon.spy();
        const response = new Response((parameter) => {
            spyFail.call();
        });
        request.user = {};

        userProvider.setNext(function (request, response) {
            spyNext.call();
        });

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.called);
    });

    it('Test userProvider handle request without user', function () {
        const userProvider = new UserProvider();
        const repository = new Repository();
        const request = new Request();
        const spyNext = sinon.spy();
        const spyFail = sinon.spy();
        const response = new Response((parameter) => {
            spyFail.call();
        });

        userProvider.attachRepository(repository);

        userProvider.setNext(function (request, response) {
            spyNext.call();
        });

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(spyNext.called);
        assert.isOk(spyFail.notCalled);
    });

    it('Test userProvider handle request with bad user object', function () {
        const userProvider = new UserProvider();
        const repositorySuccess = new RepositorySuccess();
        const request = new Request();
        const spyNext = sinon.spy();
        const spyFail = sinon.spy();
        const response = new Response((parameter) => {
            spyFail.call();
        });
        request.user = {};
        userProvider.attachRepository(repositorySuccess);

        userProvider.setNext(function (request, response) {
            spyNext.call();
        });

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.called);
    });

    it('Test userProvider handle request with user not found', function () {
        const userProvider = new UserProvider();
        const repositoryNotFound = new RepositoryNotFound();
        const request = new Request();
        const spyNext = sinon.spy();
        const spyFail = sinon.spy();
        const response = new Response((parameter) => {
            spyFail.call();
        });
        request.user = {username: "test"};
        userProvider.attachRepository(repositoryNotFound);

        userProvider.setNext(function (request, response) {
            spyNext.call();
        });

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.called);
    });

    it('Test userProvider handle request with repository failure', function () {
        const userProvider = new UserProvider();
        const repositoryFailure = new RepositoryFailure();
        const request = new Request();
        const spyNext = sinon.spy();
        const spyFail = sinon.spy();
        const response = new Response((parameter) => {
            spyFail.call();
        });
        request.user = {username: "test"};
        userProvider.attachRepository(repositoryFailure);

        userProvider.setNext(function (request, response) {
            spyNext.call();
        });

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.called);
    });

    it('Test userProvider handle request with repository success', function () {
        const userProvider = new UserProvider();
        const repositorySuccess = new RepositorySuccess();
        const request = new Request();
        const spyNext = sinon.spy();
        const spyFail = sinon.spy();
        const response = new Response((parameter) => {
            spyFail.call();
        });
        request.user = {username: "test"};
        userProvider.attachRepository(repositorySuccess);

        userProvider.setNext(function (request, response) {
            spyNext.call();
        });

        assert.isOk(spyNext.notCalled);
        assert.isOk(spyFail.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(spyNext.called);
        assert.isOk(spyFail.notCalled);
    });


    /*it('Test conf keyword', function () {
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
     smash.boot({}, false);
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
     });*/
});

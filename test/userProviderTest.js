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

class Link {
    constructor() {
        this._spy = sinon.spy();
    }
    handleRequest(request, response) {
        this._spy.call();
    }
}

class End {
    constructor() {
        this._spy = sinon.spy();
    }
    handleResponse(response) {
        this._spy.call();
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
        const end = new End();
        const response = new Response(end);

        expect(function () {
            userProvider.handleRequest();
        }).to.throw(Error);
        assert.ok(end._spy.notCalled);

        expect(function () {
            userProvider.handleRequest(request);
        }).to.throw(Error);
        assert.ok(end._spy.notCalled);

        userProvider.handleRequest(request, response);
        assert.ok(end._spy.called);

        userProvider.handleRequest(null, response);
        assert.ok(end._spy.called);
    });

    it('Test handle request without good parameters', function () {
        const userProvider = new UserProvider();
        const repository = new Repository();
        const request = new Request();
        const end = new End();
        const response = new Response(end);

        userProvider.attachRepository(repository);

        expect(function () {
            userProvider.handleRequest();
        }).to.throw(Error);

        expect(function () {
            userProvider.handleRequest(request);
        }).to.throw(Error);

        userProvider.handleRequest(null, response);
        assert.ok(end._spy.called);
    });

    it('Test userProvider handle request without repository', function () {
        const userProvider = new UserProvider();
        const request = new Request();
        const link = new Link();
        const end = new End();
        const response = new Response(end);
        request.user = {};

        userProvider.setNext(link);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.called);
    });

    it('Test userProvider handle request without user', function () {
        const userProvider = new UserProvider();
        const repository = new Repository();
        const request = new Request();
        const link = new Link();
        const end = new End();
        const response = new Response(end);

        userProvider.attachRepository(repository);

        userProvider.setNext(link);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(link._spy.called);
        assert.isOk(end._spy.notCalled);
    });

    it('Test userProvider handle request with bad user object', function () {
        const userProvider = new UserProvider();
        const repositorySuccess = new RepositorySuccess();
        const request = new Request();
        const link = new Link();
        const end = new End();
        const response = new Response(end);
        request.user = {};
        userProvider.attachRepository(repositorySuccess);

        userProvider.setNext(link);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.called);
    });

    it('Test userProvider handle request with user not found', function () {
        const userProvider = new UserProvider();
        const repositoryNotFound = new RepositoryNotFound();
        const request = new Request();
        const link = new Link();
        const end = new End();
        const response = new Response(end);
        request.user = {username: "test"};
        userProvider.attachRepository(repositoryNotFound);

        userProvider.setNext(link);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.called);
    });

    it('Test userProvider handle request with no repository', function () {
        const userProvider = new UserProvider();
        const request = new Request();
        const link = new Link();
        const end = new End();
        const response = new Response(end);
        request.user = {username: "test"};

        userProvider.setNext(link);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.called);
    });

    it('Test userProvider handle request with repository failure', function () {
        const userProvider = new UserProvider();
        const repositoryFailure = new RepositoryFailure();
        const request = new Request();
        const link = new Link();
        const end = new End();
        const response = new Response(end);
        request.user = {username: "test"};
        userProvider.attachRepository(repositoryFailure);

        userProvider.setNext(link);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.called);
    });

    it('Test userProvider handle request with repository success', function () {
        const userProvider = new UserProvider();
        const repositorySuccess = new RepositorySuccess();
        const request = new Request();
        const link = new Link();
        const end = new End();
        const response = new Response(end);
        request.user = {username: "test"};
        userProvider.attachRepository(repositorySuccess);

        userProvider.setNext(link);

        assert.isOk(link._spy.notCalled);
        assert.isOk(end._spy.notCalled);

        userProvider.handleRequest(request, response);

        assert.isOk(link._spy.called);
        assert.isOk(end._spy.notCalled);
    });
});

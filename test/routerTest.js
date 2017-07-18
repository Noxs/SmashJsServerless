var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var router = require('../core/router.js').build();
var newRequest = function () {
    var that = this;
    that.method = null;
    that.version = null;
    that.env = null;
    that.path = null;
    that.parameters = {};
    return {
        method: that.method,
        version: that.version,
        env: that.env,
        path: that.path,
        parameters: that.parameters
    };
};
function createResponse() {
    return {
        notFound: sinon.spy()
    };
}
function createNext() {
    return  sinon.spy();
}
function createFail() {
    return sinon.spy();
}
var request = newRequest();
describe('Router', function () {
    it('Test router instance', function () {
        assert.isObject(router);
    });
    it('Test router add get', function () {
        assert.equal(router.getRoutes().length, 0);
        expect(() => router.get("/request/get", function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 0);
        expect(() => router.get({path: "/request/get"})).to.throw(Error);
        assert.equal(router.getRoutes().length, 0);
        expect(() => router.get({path: "/request/get"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 1);
        expect(() => router.get({path: "/request/get", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 2);
        expect(() => router.get({path: "/request/get", env: "dev"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 3);
        expect(() => router.get({path: "/request/get", env: "dev", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 4);
        expect(() => router.get({byPass: true}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 5);
        expect(() => router.get({byPass: false}, function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 5);
    });
    it('Test router add post', function () {
        assert.equal(router.getRoutes().length, 5);
        expect(() => router.post("/request/post", function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 5);
        expect(() => router.post({path: "/request/post"})).to.throw(Error);
        assert.equal(router.getRoutes().length, 5);
        expect(() => router.post({path: "/request/post"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 6);
        expect(() => router.post({path: "/request/post", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 7);
        expect(() => router.post({path: "/request/post", env: "dev"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 8);
        expect(() => router.post({path: "/request/post", env: "dev", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 9);
        expect(() => router.post({byPass: true}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 10);
        expect(() => router.post({byPass: false}, function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 10);
    });
    it('Test router add put', function () {
        assert.equal(router.getRoutes().length, 10);
        expect(() => router.put("/request/put", function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 10);
        expect(() => router.put({path: "/request/put"})).to.throw(Error);
        assert.equal(router.getRoutes().length, 10);
        expect(() => router.put({path: "/request/put"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 11);
        expect(() => router.put({path: "/request/put", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 12);
        expect(() => router.put({path: "/request/put", env: "dev"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 13);
        expect(() => router.put({path: "/request/put", env: "dev", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 14);
        expect(() => router.put({byPass: true}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 15);
        expect(() => router.put({byPass: false}, function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 15);
    });
    it('Test router add delete', function () {
        assert.equal(router.getRoutes().length, 15);
        expect(() => router.delete("/request/delete", function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 15);
        expect(() => router.delete({path: "/request/delete"})).to.throw(Error);
        assert.equal(router.getRoutes().length, 15);
        expect(() => router.delete({path: "/request/delete"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 16);
        expect(() => router.delete({path: "/request/delete", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 17);
        expect(() => router.delete({path: "/request/delete", env: "dev"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 18);
        expect(() => router.delete({path: "/request/delete", env: "dev", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 19);
        expect(() => router.delete({byPass: true}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 20);
        expect(() => router.delete({byPass: false}, function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 20);
    });
    it('Test router add patch', function () {
        assert.equal(router.getRoutes().length, 20);
        expect(() => router.patch("/request/patch", function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 20);
        expect(() => router.patch({path: "/request/patch"})).to.throw(Error);
        assert.equal(router.getRoutes().length, 20);
        expect(() => router.patch({path: "/request/patch"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 21);
        expect(() => router.patch({path: "/request/patch", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 22);
        expect(() => router.patch({path: "/request/patch", env: "dev"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 23);
        expect(() => router.patch({path: "/request/patch", env: "dev", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 24);
        expect(() => router.patch({byPass: true}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 25);
        expect(() => router.patch({byPass: false}, function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 25);
    });
    it('Test router add options', function () {
        assert.equal(router.getRoutes().length, 25);
        expect(() => router.options("/request/options", function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 25);
        expect(() => router.options({path: "/request/options"})).to.throw(Error);
        assert.equal(router.getRoutes().length, 25);
        expect(() => router.options({path: "/request/options"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 26);
        expect(() => router.options({path: "/request/options", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 27);
        expect(() => router.options({path: "/request/options", env: "dev"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 28);
        expect(() => router.options({path: "/request/options", env: "dev", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 29);
        expect(() => router.options({byPass: true}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 30);
        expect(() => router.options({byPass: false}, function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 30);
    });
    it('Test router add head', function () {
        assert.equal(router.getRoutes().length, 30);
        expect(() => router.head("/request/head", function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 30);
        expect(() => router.head({path: "/request/head"})).to.throw(Error);
        assert.equal(router.getRoutes().length, 30);
        expect(() => router.head({path: "/request/head"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 31);
        expect(() => router.head({path: "/request/head", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 32);
        expect(() => router.head({path: "/request/head", env: "dev"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 33);
        expect(() => router.head({path: "/request/head", env: "dev", version: "v1"}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 34);
        expect(() => router.head({byPass: true}, function (request, response) {})).to.not.throw();
        assert.equal(router.getRoutes().length, 35);
        expect(() => router.head({byPass: false}, function (request, response) {})).to.throw(Error);
        assert.equal(router.getRoutes().length, 35);
    });
    it('Test router clear routes', function () {
        assert.equal(router.getRoutes().length, 35);
        router.clearRoutes();
        assert.equal(router.getRoutes().length, 0);

    });
    it('Test router handle get request', function () {
        var response = createResponse();
        var next = createNext();
        var fail = createFail();
        router.setNext(next, fail);
        router.clearRoutes();
        request.method = "GET";
        request.path = "/";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.post({path: "/request/post"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.post({path: "/"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.post({byPass: true}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.get({path: "/request/get"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.exists(request.route.byPass);
        }, fail);
        router.get({byPass: true}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        router.clearRoutes();

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.get({path: "/"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
        assert.isOk(response.notFound.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.get({path: "/get"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/get");
        }, fail);
        request.path = "/get";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        request.path = "/request/get";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:get");
        }, fail);
        router.get({path: "/request/:get"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        assert.equal(request.parameters.get, "get");

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:get");
        }, fail);
        router.get({path: "/request/:get"}, function (request, response) {});
        request.path = "/request/foo@bar";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        assert.equal(request.parameters.get, "foo@bar");


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:get");
        }, fail);
        router.get({path: "/request/:get"}, function (request, response) {});
        request.path = "/request/foo@bar.com";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        assert.equal(request.parameters.get, "foo@bar.com");


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request2/:get");
        }, fail);
        router.get({path: "/request2/:get"}, function (request, response) {});
        request.path = "/request2/get";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:get/details");
        }, fail);
        router.get({path: "/request/:get/details"}, function (request, response) {});
        request.path = "/request/get/details";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:get");
            assert.equal(request.parameters.get, "get");
        }, fail);
        request.path = "/request/get";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:get/details/:working");
            assert.equal(request.parameters.get, "get");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.get({path: "/request/:get/details/:working"}, function (request, response) {});
        request.path = "/request/get/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:get/details/:working");
            assert.equal(request.parameters.get, "get@troll");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.get({path: "/request/:get/details/:working"}, function (request, response) {});
        request.path = "/request/get@troll/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);

    });
    it('Test router handle post request', function () {
        var response = createResponse();
        var next = createNext();
        var fail = createFail();
        router.setNext(next, fail);
        request.method = "POST";
        request.path = "/";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.post({path: "/request/post"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.post({path: "/request/post"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.exists(request.route.byPass);
        }, fail);
        router.post({byPass: true}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        router.clearRoutes();

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.post({path: "/"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
        assert.isOk(response.notFound.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.post({path: "/post"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/post");
        }, fail);
        request.path = "/post";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        request.path = "/request/post";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:post");
        }, fail);
        router.post({path: "/request/:post"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request2/:post");
        }, fail);
        router.post({path: "/request2/:post"}, function (request, response) {});
        request.path = "/request2/post";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:post/details");
        }, fail);
        router.post({path: "/request/:post/details"}, function (request, response) {});
        request.path = "/request/post/details";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:post");
            assert.equal(request.parameters.post, "post");
        }, fail);
        request.path = "/request/post";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:post/details/:working");
            assert.equal(request.parameters.post, "post");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.post({path: "/request/:post/details/:working"}, function (request, response) {});
        request.path = "/request/post/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
    });
    it('Test router handle put request', function () {
        var response = createResponse();
        var next = createNext();
        var fail = createFail();
        router.setNext(next, fail);
        request.method = "PUT";
        request.path = "/";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.put({path: "/request/put"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.put({path: "/request/put"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.exists(request.route.byPass);
        }, fail);
        router.put({byPass: true}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        router.clearRoutes();

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.put({path: "/"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
        assert.isOk(response.notFound.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.put({path: "/put"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/put");
        }, fail);
        request.path = "/put";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        request.path = "/request/put";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:put");
        }, fail);
        router.put({path: "/request/:put"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request2/:put");
        }, fail);
        router.put({path: "/request2/:put"}, function (request, response) {});
        request.path = "/request2/put";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:put/details");
        }, fail);
        router.put({path: "/request/:put/details"}, function (request, response) {});
        request.path = "/request/put/details";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:put");
            assert.equal(request.parameters.put, "put");
        }, fail);
        request.path = "/request/put";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:put/details/:working");
            assert.equal(request.parameters.put, "put");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.put({path: "/request/:put/details/:working"}, function (request, response) {});
        request.path = "/request/put/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
    });
    it('Test router handle delete request', function () {
        var response = createResponse();
        var next = createNext();
        var fail = createFail();
        router.setNext(next, fail);
        request.method = "DELETE";
        request.path = "/";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.delete({path: "/request/delete"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.delete({path: "/request/delete"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.exists(request.route.byPass);
        }, fail);
        router.delete({byPass: true}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        router.clearRoutes();

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.delete({path: "/"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
        assert.isOk(response.notFound.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.delete({path: "/delete"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/delete");
        }, fail);
        request.path = "/delete";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        request.path = "/request/delete";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:delete");
        }, fail);
        router.delete({path: "/request/:delete"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request2/:delete");
        }, fail);
        router.delete({path: "/request2/:delete"}, function (request, response) {});
        request.path = "/request2/delete";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:delete/details");
        }, fail);
        router.delete({path: "/request/:delete/details"}, function (request, response) {});
        request.path = "/request/delete/details";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:delete");
            assert.equal(request.parameters.delete, "delete");
        }, fail);
        request.path = "/request/delete";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:delete/details/:working");
            assert.equal(request.parameters.delete, "delete");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.delete({path: "/request/:delete/details/:working"}, function (request, response) {});
        request.path = "/request/delete/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
    });
    it('Test router handle options request', function () {
        var response = createResponse();
        var next = createNext();
        var fail = createFail();
        router.setNext(next, fail);
        request.method = "OPTIONS";
        request.path = "/";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.options({path: "/request/options"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.options({path: "/request/options"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.exists(request.route.byPass);
        }, fail);
        router.options({byPass: true}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        router.clearRoutes();

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.options({path: "/"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
        assert.isOk(response.notFound.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.options({path: "/options"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/options");
        }, fail);
        request.path = "/options";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        request.path = "/request/options";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:options");
        }, fail);
        router.options({path: "/request/:options"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request2/:options");
        }, fail);
        router.options({path: "/request2/:options"}, function (request, response) {});
        request.path = "/request2/options";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:options/details");
        }, fail);
        router.options({path: "/request/:options/details"}, function (request, response) {});
        request.path = "/request/options/details";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:options");
            assert.equal(request.parameters.options, "options");
        }, fail);
        request.path = "/request/options";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:options/details/:working");
            assert.equal(request.parameters.options, "options");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.options({path: "/request/:options/details/:working"}, function (request, response) {});
        request.path = "/request/options/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
    });
    it('Test router handle patch request', function () {
        var response = createResponse();
        var next = createNext();
        var fail = createFail();
        router.setNext(next, fail);
        request.method = "PATCH";
        request.path = "/";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.patch({path: "/request/patch"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.patch({path: "/request/patch"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.exists(request.route.byPass);
        }, fail);
        router.patch({byPass: true}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        router.clearRoutes();

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.patch({path: "/"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
        assert.isOk(response.notFound.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.patch({path: "/patch"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/patch");
        }, fail);
        request.path = "/patch";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        request.path = "/request/patch";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:patch");
        }, fail);
        router.patch({path: "/request/:patch"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request2/:patch");
        }, fail);
        router.patch({path: "/request2/:patch"}, function (request, response) {});
        request.path = "/request2/patch";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:patch/details");
        }, fail);
        router.patch({path: "/request/:patch/details"}, function (request, response) {});
        request.path = "/request/patch/details";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:patch");
            assert.equal(request.parameters.patch, "patch");
        }, fail);
        request.path = "/request/patch";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:patch/details/:working");
            assert.equal(request.parameters.patch, "patch");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.patch({path: "/request/:patch/details/:working"}, function (request, response) {});
        request.path = "/request/patch/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
    });
    it('Test router handle head request', function () {
        var response = createResponse();
        var next = createNext();
        var fail = createFail();
        router.setNext(next, fail);
        request.method = "HEAD";
        request.path = "/";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.head({path: "/request/head"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        router.head({path: "/request/head"}, function (request, response) {});
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.exists(request.route.byPass);
        }, fail);
        router.head({byPass: true}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);
        router.clearRoutes();

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.head({path: "/"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
        assert.isOk(response.notFound.notCalled);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/");
        }, fail);
        router.head({path: "/head"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/head");
        }, fail);
        request.path = "/head";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(next, fail);
        request.path = "/request/head";
        assert.isFalse(router.handleRequest(request, response));
        assert.isOk(response.notFound.called);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);

        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:head");
        }, fail);
        router.head({path: "/request/:head"}, function (request, response) {});
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(response.notFound.notCalled);
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request2/:head");
        }, fail);
        router.head({path: "/request2/:head"}, function (request, response) {});
        request.path = "/request2/head";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:head/details");
        }, fail);
        router.head({path: "/request/:head/details"}, function (request, response) {});
        request.path = "/request/head/details";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:head");
            assert.equal(request.parameters.head, "head");
        }, fail);
        request.path = "/request/head";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);


        response = createResponse();
        next = createNext();
        fail = createFail();
        router.setNext(function (request, response) {
            assert.isObject(request.route);
            assert.equal(request.route.path, "/request/:head/details/:working");
            assert.equal(request.parameters.head, "head");
            assert.equal(request.parameters.working, "nice");
        }, fail);
        router.head({path: "/request/:head/details/:working"}, function (request, response) {});
        request.path = "/request/head/details/nice";
        assert.isTrue(router.handleRequest(request, response));
        assert.isOk(fail.notCalled);
    });
    it('Test router interpolation change', function () {
        assert.equal(router.getInterpolation(), ":");
        router.setInterpolation("#");
        assert.equal(router.getInterpolation(), "#");
    });
});

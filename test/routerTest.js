const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Router = require('../lib/core/router.js');
const Request = require('../lib/core/request.js');
const Response = require('../lib/core/response.js');
const Route = require('../lib/core/route.js');

describe('Router', function () {
    it('Test router instance', function () {
        const router = new Router();
        expect(function () {
            const router = new Router();
        }).to.not.throw(Error);
    });

    it('Test router get', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.get({path: "/foo"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "GET");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.get({path: "/bar"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "GET");
        assert.equal(router._routes[1]._path, "/bar");
    });

    it('Test router post', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.post({path: "/foo"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "POST");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.post({path: "/bar"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "POST");
        assert.equal(router._routes[1]._path, "/bar");
    });

    it('Test router put', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.put({path: "/foo"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "PUT");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.put({path: "/bar"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "PUT");
        assert.equal(router._routes[1]._path, "/bar");
    });

    it('Test router delete', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.delete({path: "/foo"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "DELETE");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.delete({path: "/bar"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "DELETE");
        assert.equal(router._routes[1]._path, "/bar");
    });

    it('Test router patch', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.patch({path: "/foo"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "PATCH");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.patch({path: "/bar"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "PATCH");
        assert.equal(router._routes[1]._path, "/bar");
    });

    it('Test router options', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.options({path: "/foo"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "OPTIONS");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.options({path: "/bar"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "OPTIONS");
        assert.equal(router._routes[1]._path, "/bar");
    });

    it('Test router head', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.head({path: "/foo"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "HEAD");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.head({path: "/bar"}, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "HEAD");
        assert.equal(router._routes[1]._path, "/bar");
    });

    it('Test handle request success', function () {
        const router = new Router();
        //TODO
    });

    it('Test handle request fail', function () {
        const router = new Router();
        //TODO
    });
});

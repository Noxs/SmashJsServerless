const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Router = require('../../../lib/middleware/apiGatewayProxyRest/lib/router');
const Request = require('../../../lib/middleware/apiGatewayProxyRest/lib/request');
const Response = require('../../../lib/middleware/apiGatewayProxyRest/lib/response');
const Route = require('../../../lib/middleware/apiGatewayProxyRest/lib/route');

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
        const route1 = router.get({ path: "/foo", action: "GetFoo" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "GET");
        assert.equal(router._routes[0].method, "GET");
        assert.equal(router._routes[0]._path, "/foo");
        assert.equal(router._routes[0].path, "/foo");
        assert.equal(router._routes[0]._action, "GetFoo");
        assert.equal(router._routes[0].action, "GetFoo");

        const route2 = router.get({ path: "/bar", action: "GetBar" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route2);
        assert.lengthOf(router._routes, 2);
        assert.equal(router._routes[1]._method, "GET");
        assert.equal(router._routes[1].method, "GET");
        assert.equal(router._routes[1]._path, "/bar");
        assert.equal(router._routes[1].path, "/bar");
        assert.equal(router._routes[1]._action, "GetBar");
        assert.equal(router._routes[1].action, "GetBar");
    });

    it('Test router post', function () {
        const router = new Router();
        assert.lengthOf(router._routes, 0);
        const route1 = router.post({ path: "/foo", action: "PostFoo" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "POST");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.post({ path: "/bar", action: "PostBar" }, function (request, response) {
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
        const route1 = router.put({ path: "/foo", action: "PutFoo" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "PUT");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.put({ path: "/bar", action: "PutBar" }, function (request, response) {
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
        const route1 = router.delete({ path: "/foo", action: "DeleteFoo" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "DELETE");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.delete({ path: "/bar", action: "DeleteBar" }, function (request, response) {
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
        const route1 = router.patch({ path: "/foo", action: "PatchFoo" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "PATCH");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.patch({ path: "/bar", action: "PatchBar" }, function (request, response) {
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
        const route1 = router.options({ path: "/foo", action: "OptionsFoo" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "OPTIONS");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.options({ path: "/bar", action: "OptionsBar" }, function (request, response) {
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
        const route1 = router.head({ path: "/foo", action: "HeadFoo" }, function (request, response) {
        });

        //assert.instanceOf(route, Route); not working
        assert.isObject(route1);
        assert.lengthOf(router._routes, 1);
        assert.equal(router._routes[0]._method, "HEAD");
        assert.equal(router._routes[0]._path, "/foo");

        const route2 = router.head({ path: "/bar", action: "HeadBar" }, function (request, response) {
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

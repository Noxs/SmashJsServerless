const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Route = require('../../../lib/middleware/apiGatewayProxy/lib/route.js');
const Request = require('../../../lib/middleware/apiGatewayProxy/lib/request.js');
const Console = require('../../../lib/util/console.js');
const apiGatewayProxyRequest = require('../../util/apiGatewayProxyRequest.js');

describe('Route', function () {
    it('Test route build instance success', function () {
        expect(function () {
            const route = new Route("GET", { path: "/", action: "Get" }, (request, response) => {
            });
        }).to.not.throw(Error);
        expect(function () {
            const route = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => {
            });
        }).to.not.throw(Error);
        expect(function () {
            const route = new Route("GET", { path: "/", action: "Get" }, (request, response) => {
            });
        }).to.not.throw(Error);
        expect(function () {
            const route = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => {
            });
        }).to.not.throw(Error);
    });

    it('Test route build success property', function () {
        const route = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
    });

    it('Test route build instance failure', function () {
        expect(function () {
            const route = new Route();
        }).to.throw(Error);
        expect(function () {
            const route = new Route("TROLL");
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET");
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", {});
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", {}, "");
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", {}, () => {
            });
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", {}, (request, response) => {
            });
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", { path: [] }, (request, response) => {
            });
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", { path: "/", version: {} }, (request, response) => {
            });
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", { path: "/", action: {} }, (request, response) => {
            });
        }).to.throw(Error);
    });

    it('Test route access to method', function () {
        const routeGet = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.equal(routeGet.method, "GET");
        const routeDelete = new Route("DELETE", { path: "/", version: "01-01-2000", action: "Delete" }, (request, response) => {
        });
        assert.equal(routeDelete.method, "DELETE");
    });

    it('Test route access to version', function () {
        const routeVersion = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.equal(routeVersion.version, "01-01-2000");
        const routeDefault = new Route("DELETE", { path: "/", action: "Delete" }, (request, response) => {
        });
        assert.equal(routeDefault.version, "default");
    });

    it('Test route build route without parameters', function () {
        const route1 = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.deepEqual(route1._routeParameters, []);

        const route2 = new Route("GET", { path: "/foo", version: "01-01-2000", action: "GetFoo" }, (request, response) => {
        });
        assert.deepEqual(route2._routeParameters, []);

        const route3 = new Route("GET", { path: "/foo/bar", version: "01-01-2000", action: "GetFooBar" }, (request, response) => {
        });
        assert.deepEqual(route3._routeParameters, []);
    });

    it('Test route build route with parameters', function () {
        const route1 = new Route("GET", { path: "/:foo", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.equal(route1._routeParameters[0]._keyword, ":foo");
        assert.equal(route1._routeParameters[0]._position, 1);

        const route2 = new Route("GET", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.equal(route2._routeParameters[0]._keyword, ":foo");
        assert.equal(route2._routeParameters[0]._position, 1);
        assert.equal(route2._routeParameters[1]._keyword, ":bar");
        assert.equal(route2._routeParameters[1]._position, 2);

        const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.equal(route3._routeParameters[0]._keyword, ":foo");
        assert.equal(route3._routeParameters[0]._position, 2);
        assert.equal(route3._routeParameters[1]._keyword, ":bar");
        assert.equal(route3._routeParameters[1]._position, 4);
    });

    it('Test route build route parameters failure', function () {
        expect(function () {
            const route = new Route("GET", { path: "/:", version: "01-01-2000", action: "Get" }, (request, response) => {
            });
        }).to.throw(Error);
    });

    it('Test route match', function () {
        const request1 = new Request(apiGatewayProxyRequest.good);
        request1.method = "GET";
        request1.version = "01-01-2000";
        request1.path = "/customid";
        const route1 = new Route("GET", { path: "/:foo", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.isTrue(route1.match(request1));

        const request2 = new Request(apiGatewayProxyRequest.good);
        request2.method = "GET";
        request2.version = "01-01-2000";
        request2.path = "/customid/anotherid";
        const route2 = new Route("GET", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.isTrue(route2.match(request2));

        const request3 = new Request(apiGatewayProxyRequest.good);
        request3.method = "GET";
        request3.version = "01-01-2000";
        request3.path = "/foo/customid/bar/anotherid";
        const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.isTrue(route3.match(request3));

        const request4 = new Request(apiGatewayProxyRequest.good);
        request4.method = "GET";
        request4.version = "01-01-2000";
        request4.path = "/foo/customid/bar/anotherid";
        const route4 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.isTrue(route4.match(request4));
    });

    it('Test route match parameters build', function () {
        const request1 = new Request(apiGatewayProxyRequest.good);
        request1.method = "GET";
        request1.version = "01-01-2000";
        request1.path = "/customid";
        const route1 = new Route("GET", { path: "/:foo", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        route1.match(request1);
        assert.equal(route1.parameters['foo'], "customid");

        const request2 = new Request(apiGatewayProxyRequest.good);
        request2.method = "GET";
        request2.version = "01-01-2000";
        request2.path = "/customid/anotherid";
        const route2 = new Route("GET", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        route2.match(request2);
        assert.equal(route2.parameters['foo'], "customid");
        assert.equal(route2.parameters['bar'], "anotherid");

        const request3 = new Request(apiGatewayProxyRequest.good);
        request3.method = "GET";
        request3.version = "01-01-2000";
        request3.path = "/foo/customid/bar/anotherid";
        const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        route3.match(request3);
        assert.equal(route3.parameters['foo'], "customid");
        assert.equal(route3.parameters['bar'], "anotherid");
    });

    it('Test route match no parameters build', function () {
        const request = new Request(apiGatewayProxyRequest.good);
        request.method = "GET";
        request.version = "01-01-2000";
        request.path = "/foo";
        const route = new Route("GET", { path: "/foo", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        route.match(request);
        assert.isArray(route.parameters);
        assert.lengthOf(route.parameters, 0);
    });

    it('Test route not match', function () {
        const request1 = new Request(apiGatewayProxyRequest.good);
        request1.method = "GET";
        request1.version = "01-01-2000";
        request1.path = "/customid";
        const route1 = new Route("GET", { path: "/foo", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.isFalse(route1.match(request1));

        const request2 = new Request(apiGatewayProxyRequest.good);
        request2.method = "GET";
        request2.version = "01-01-2000";
        request2.path = "/customid/anotherid";
        const route2 = new Route("POST", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.isFalse(route2.match(request2));

        const request3 = new Request(apiGatewayProxyRequest.good);
        request3.method = "GET";
        request3.version = "02-01-2000";
        request3.path = "/foo/customid/bar/anotherid";
        const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
        });
        assert.isFalse(route3.match(request3));
    });
});

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
            const route = new Route("GET", {path: "/"}, (request, response) => {
            });
        }).to.not.throw(Error);
        expect(function () {
            const route = new Route("GET", {path: "/", version: "01-01-2000"}, (request, response) => {
            });
        }).to.not.throw(Error);
        expect(function () {
            const route = new Route("GET", {path: "/", authorizations: []}, (request, response) => {
            });
        }).to.not.throw(Error);
        expect(function () {
            const route = new Route("GET", {path: "/", authorizations: [], version: "01-01-2000"}, (request, response) => {
            });
        }).to.not.throw(Error);
    });

    it('Test route build success property', function () {
        const route = new Route("GET", {path: "/", authorizations: [], version: "01-01-2000"}, (request, response) => {
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
            const route = new Route("GET", {path: []}, (request, response) => {
            });
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", {path: "/", authorizations: ""}, (request, response) => {
            });
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", {path: "/", version: {}}, (request, response) => {
            });
        }).to.throw(Error);
        expect(function () {
            const route = new Route("GET", {path: "/", authorizations: "  "}, (request, response) => {
            });
        }).to.throw(Error);
    });

    it('Test route access to method', function () {
        const routeGet = new Route("GET", {path: "/", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.equal(routeGet.method, "GET");
        const routeDelete = new Route("DELETE", {path: "/", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.equal(routeDelete.method, "DELETE");
    });

    it('Test route access to version', function () {
        const routeVersion = new Route("GET", {path: "/", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.equal(routeVersion.version, "01-01-2000");
        const routeDefault = new Route("DELETE", {path: "/", authorizations: []}, (request, response) => {
        });
        assert.equal(routeDefault.version, "default");
    });

    it('Test route build route without parameters', function () {
        const route1 = new Route("GET", {path: "/", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.deepEqual(route1._routeParameters, []);

        const route2 = new Route("GET", {path: "/foo", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.deepEqual(route2._routeParameters, []);

        const route3 = new Route("GET", {path: "/foo/bar", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.deepEqual(route3._routeParameters, []);
    });

    it('Test route build route with parameters', function () {
        const route1 = new Route("GET", {path: "/:foo", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.equal(route1._routeParameters[0]._keyword, ":foo");
        assert.equal(route1._routeParameters[0]._position, 1);

        const route2 = new Route("GET", {path: "/:foo/:bar", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.equal(route2._routeParameters[0]._keyword, ":foo");
        assert.equal(route2._routeParameters[0]._position, 1);
        assert.equal(route2._routeParameters[1]._keyword, ":bar");
        assert.equal(route2._routeParameters[1]._position, 2);

        const route3 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: [], version: "01-01-2000"}, (request, response) => {
        });
        assert.equal(route3._routeParameters[0]._keyword, ":foo");
        assert.equal(route3._routeParameters[0]._position, 2);
        assert.equal(route3._routeParameters[1]._keyword, ":bar");
        assert.equal(route3._routeParameters[1]._position, 4);
    });

    it('Test route build route parameters failure', function () {
        expect(function () {
            const route = new Route("GET", {path: "/:", authorizations: [], version: "01-01-2000"}, (request, response) => {
            });
        }).to.throw(Error);
    });

    it('Test has role', function () {
        const route1 = new Route("GET", {path: "/:foo", authorizations: ["ROLE_USER"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isTrue(route1.hasRoles(["ROLE_USER"]));

        const route2 = new Route("GET", {path: "/:foo/:bar", authorizations: ["ROLE_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isTrue(route2.hasRoles(["ROLE_ADMIN"]));

        const route3 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isTrue(route3.hasRoles(["ROLE_USER"]));
        assert.isTrue(route3.hasRoles(["ROLE_ADMIN"]));
        assert.isTrue(route3.hasRoles(["ROLE_SUPER_ADMIN"]));
        assert.isTrue(route3.hasRoles(["ROLE_USER", "ROLE_ADMIN"]));
        assert.isTrue(route3.hasRoles(["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]));
        assert.isTrue(route3.hasRoles(["ROLE_USER", "ROLE_SUPER_ADMIN"]));
        assert.isTrue(route3.hasRoles(["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]));
    });

    it('Test has not role', function () {
        const route1 = new Route("GET", {path: "/:foo", authorizations: ["ROLE_USER"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isFalse(route1.hasRoles(["ROLE_ADMIN"]));

        const route2 = new Route("GET", {path: "/:foo/:bar", authorizations: ["ROLE_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isFalse(route2.hasRoles(["ROLE_USER"]));

        const route3 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_SUPER_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isFalse(route3.hasRoles(["ROLE_USER"]));
        assert.isFalse(route3.hasRoles(["ROLE_USER", "ROLE_ADMIN"]));
    });

    it('Test add authorization', function () {
        const route = new Route("GET", {path: "/:foo", version: "01-01-2000"}, (request, response) => {
        });
        assert.isNull(route.authorizations);
        route.addAuthorization("ROLE_USER");
        assert.lengthOf(route.authorizations, 1);
        assert.equal(route.authorizations[0], "ROLE_USER");
        route.addAuthorization("ROLE_USER");
        assert.lengthOf(route.authorizations, 1);
        assert.equal(route.authorizations[0], "ROLE_USER");
        route.addAuthorization("ROLE_ADMIN");
        assert.lengthOf(route.authorizations, 2);
        assert.equal(route.authorizations[0], "ROLE_USER");
        assert.equal(route.authorizations[1], "ROLE_ADMIN");
    });

    it('Test add authorization failure', function () {
        const route = new Route("GET", {path: "/:foo", version: "01-01-2000"}, (request, response) => {
        });
        expect(function () {
            route.addAuthorization({});
        }).to.throw(Error);
    });

    it('Test add authorizations', function () {
        const route = new Route("GET", {path: "/:foo", version: "01-01-2000"}, (request, response) => {
        });
        assert.isNull(route.authorizations);
        route.addAuthorizations(["ROLE_USER", "ROLE_ADMIN"]);
        assert.lengthOf(route.authorizations, 2);
        assert.equal(route.authorizations[0], "ROLE_USER");
        assert.equal(route.authorizations[1], "ROLE_ADMIN");
    });

    it('Test add authorizations failure', function () {
        const route = new Route("GET", {path: "/:foo", version: "01-01-2000"}, (request, response) => {
        });
        expect(function () {
            route.addAuthorizations({});
        }).to.throw(Error);
        expect(function () {
            route.addAuthorizations("ROLE_USER");
        }).to.throw(Error);
    });

    it('Test route match', function () {
        const request1 = new Request(apiGatewayProxyRequest.good);
        request1.method = "GET";
        request1.version = "01-01-2000";
        request1.path = "/customid";
        const route1 = new Route("GET", {path: "/:foo", authorizations: ["ROLE_USER"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isTrue(route1.match(request1));

        const request2 = new Request(apiGatewayProxyRequest.good);
        request2.method = "GET";
        request2.version = "01-01-2000";
        request2.path = "/customid/anotherid";
        const route2 = new Route("GET", {path: "/:foo/:bar", authorizations: ["ROLE_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isTrue(route2.match(request2));

        const request3 = new Request(apiGatewayProxyRequest.good);
        request3.method = "GET";
        request3.version = "01-01-2000";
        request3.path = "/foo/customid/bar/anotherid";
        const route3 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_SUPER_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isTrue(route3.match(request3));
    });

    it('Test route match parameters build', function () {
        const request1 = new Request(apiGatewayProxyRequest.good);
        request1.method = "GET";
        request1.version = "01-01-2000";
        request1.path = "/customid";
        const route1 = new Route("GET", {path: "/:foo", authorizations: ["ROLE_USER"], version: "01-01-2000"}, (request, response) => {
        });
        route1.match(request1);
        assert.equal(route1.parameters['foo'], "customid");

        const request2 = new Request(apiGatewayProxyRequest.good);
        request2.method = "GET";
        request2.version = "01-01-2000";
        request2.path = "/customid/anotherid";
        const route2 = new Route("GET", {path: "/:foo/:bar", authorizations: ["ROLE_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        route2.match(request2);
        assert.equal(route2.parameters['foo'], "customid");
        assert.equal(route2.parameters['bar'], "anotherid");

        const request3 = new Request(apiGatewayProxyRequest.good);
        request3.method = "GET";
        request3.version = "01-01-2000";
        request3.path = "/foo/customid/bar/anotherid";
        const route3 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_SUPER_ADMIN"], version: "01-01-2000"}, (request, response) => {
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
        const route = new Route("GET", {path: "/foo", authorizations: ["ROLE_USER"], version: "01-01-2000"}, (request, response) => {
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
        const route1 = new Route("GET", {path: "/foo", authorizations: ["ROLE_USER"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isFalse(route1.match(request1));

        const request2 = new Request(apiGatewayProxyRequest.good);
        request2.method = "GET";
        request2.version = "01-01-2000";
        request2.path = "/customid/anotherid";
        const route2 = new Route("POST", {path: "/:foo/:bar", authorizations: ["ROLE_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isFalse(route2.match(request2));

        const request3 = new Request(apiGatewayProxyRequest.good);
        request3.method = "GET";
        request3.version = "02-01-2000";
        request3.path = "/foo/customid/bar/anotherid";
        const route3 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_SUPER_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        assert.isFalse(route3.match(request3));
    });
});

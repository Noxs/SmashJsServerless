const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Authorization = require('../lib/core/authorization.js');
const Route = require('../lib/core/route.js');
class Config {
    get(section) {
        return {
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
                },
                "ROLE_INTERNAL_WORKER": {
                },
                "ROLE_EXTERNAL_WORKER": {
                }
            }
        };
    }
}

class ConfigEmpty {
    get(section) {
        return undefined;
    }
}

describe('Authorization', function () {
    it('Test authorization instance success', function () {
        const config = new Config();
        expect(function () {
            const authorization = new Authorization(config);
        }).to.not.throw(Error);
    });

    it('Test authorization instance failure', function () {
        expect(function () {
            const authorization = new Authorization();
        }).to.throw(Error);
        expect(function () {
            const authorization = new Authorization({});
        }).to.throw(Error);
    });

    it('Test build route authorizations success', function () {
        const config = new Config();
        const authorization = new Authorization(config);

        const route1 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_USER"], version: "01-01-2000"}, (request, response) => {
        });
        expect(function () {
            authorization.buildRouteAuthorizations(route1);
        }).to.not.throw(Error);
        console.log(route1.authorizations);
        assert.deepEqual(route1.authorizations, ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]);

        const route2 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        expect(function () {
            authorization.buildRouteAuthorizations(route2);
        }).to.not.throw(Error);
        assert.deepEqual(route2.authorizations, ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]);

        const route3 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_SUPER_ADMIN"], version: "01-01-2000"}, (request, response) => {
        });
        expect(function () {
            authorization.buildRouteAuthorizations(route3);
        }).to.not.throw(Error);
        assert.deepEqual(route3.authorizations, ["ROLE_SUPER_ADMIN"]);

        const route4 = new Route("GET", {path: "/foo/:foo/bar/:bar", authorizations: ["ROLE_SUPER_ADMIN", "ROLE_EXTERNAL_WORKER"], version: "01-01-2000"}, (request, response) => {
        });
        expect(function () {
            authorization.buildRouteAuthorizations(route4);
        }).to.not.throw(Error);
        assert.deepEqual(route4.authorizations, ["ROLE_SUPER_ADMIN", "ROLE_EXTERNAL_WORKER"]);
    });

    it('Test build route authorizations empty', function () {
        const config = new Config();
        const authorization = new Authorization(config);
        const route = new Route("GET", {path: "/foo/:foo/bar/:bar", version: "01-01-2000"}, (request, response) => {
        });
        expect(function () {
            authorization.buildRouteAuthorizations(route);
        }).to.not.throw(Error);
        assert.deepEqual(route.authorizations, null);
    });

    it('Test handle request success', function () {
        //TODO
    });

    it('Test handle request failure', function () {
        //TODO
    });
});

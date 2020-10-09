const Route = require('../../../../lib/middleware/apiGatewayProxyRest/lib/route');
const Request = require('../../../../lib/middleware/apiGatewayProxyRest/lib/request');
const apiGatewayProxyRequest = require('../../../apiGatewayProxyRequest');

describe('Route', () => {
	it('Test route build instance success', () => {
		expect(() => new Route({ version: "01-01-2000", action: "Get", request: { path: "/test", method: "GET" } }, (request, response) => { })).not.toThrow();
	});

	it('Test route build success property', () => {
		expect(() => new Route({ version: "01-01-2000", action: "Get", request: { method: "GET", path: "/test" } }, (request, response) => { })).not.toThrow();
	});

	it('Test route build instance failure', () => {
		expect(() => new Route()).toThrow();
		expect(() => new Route("TROLL")).toThrow();
		expect(() => new Route("GET")).toThrow();
		expect(() => new Route("GET", {})).toThrow();
		expect(() => new Route("GET", {}, "")).toThrow();
		expect(() => new Route("GET", {}, () => { })).toThrow();
		expect(() => new Route("GET1", {}, (request, response) => { })).toThrow();
		expect(() => new Route("GET", { path: [] }, (request, response) => { })).toThrow();
		expect(() => new Route("GET", { path: "/test", version: {} }, (request, response) => { })).toThrow();
		expect(() => new Route("GET", { path: "/test", action: {} }, (request, response) => { })).toThrow();
	});

	it('Test route access to method', () => {
		const routeGet = new Route({ version: "01-01-2000", action: "Get", request: { path: "/test", method: "GET" } }, (request, response) => { });
		expect(routeGet.method).toBe("GET");
		const routeDelete = new Route({ version: "01-01-2000", action: "Delete", request: { path: "/test", method: "DELETE" } }, (request, response) => { });
		expect(routeDelete.method).toBe("DELETE");
	});

	it('Test route access to version', () => {
		const routeVersion = new Route({ version: "01-01-2000", action: "Get", request: { path: "/test", method: "GET" } }, (request, response) => { });
		expect(routeVersion.version).toBe("01-01-2000");
		const routeDefault = new Route({ version: "01-01-2000", action: "Delete", request: { path: "/test", method: "DELETE" } }, (request, response) => { });
		expect(routeDefault.version).toBe("01-01-2000");
	});

	it('Test route build route without parameters', () => {
		const route1 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/test", method: "GET" } }, (request, response) => { });
		expect(route1.routeParameters).toStrictEqual([]);
		const route2 = new Route({ version: "01-01-2000", action: "GetFoo", request: { path: "/foo", method: "GET" } }, (request, response) => { });
		expect(route2.routeParameters).toStrictEqual([]);
		const route3 = new Route({ version: "01-01-2000", action: "GetFooBar", request: { path: "/foo/bar", method: "GET" } }, (request, response) => { });
		expect(route3.routeParameters).toStrictEqual([]);
	});

	it('Test route build route with parameters', () => {
		const route1 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/:foo", method: "GET" } }, (request, response) => { });
		expect(route1.routeParameters[0].keyword).toBe(":foo");
		expect(route1.routeParameters[0].position).toBe(1);
		const route2 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/:foo/:bar", method: "GET" } }, (request, response) => { });
		expect(route2.routeParameters[0].keyword).toBe(":foo");
		expect(route2.routeParameters[0].position).toBe(1);
		expect(route2.routeParameters[1].keyword).toBe(":bar");
		expect(route2.routeParameters[1].position).toBe(2);

		const route3 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo/:foo/bar/:bar", method: "GET" } }, (request, response) => {
		});
		expect(route3.routeParameters[0].keyword).toBe(":foo");
		expect(route3.routeParameters[0].position).toBe(2);
		expect(route3.routeParameters[1].keyword).toBe(":bar");
		expect(route3.routeParameters[1].position).toBe(4);
	});

	it('Test route build route parameters failure', () => {
		expect(() => new Route({ version: "01-01-2000", action: "Get", request: { path: "/:", method: "GET" } }, (request, response) => { })).toThrow();
	});

	it('Test route match', () => {
		const request1 = new Request(apiGatewayProxyRequest.good);
		request1.method = "GET";
		request1.version = "01-01-2000";
		request1.path = "/customid";
		const route1 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/:foo", method: "GET" } }, (request, response) => { });
		expect(route1.match(request1)).toBeTrue();

		const request2 = new Request(apiGatewayProxyRequest.good);
		request2.method = "GET";
		request2.version = "01-01-2000";
		request2.path = "/customid/anotherid";
		const route2 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/:foo/:bar", method: "GET" } }, (request, response) => { });
		expect(route2.match(request2)).toBeTrue();

		const request3 = new Request(apiGatewayProxyRequest.good);
		request3.method = "GET";
		request3.version = "01-01-2000";
		request3.path = "/foo/customid/bar/anotherid";
		const route3 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo/:foo/bar/:bar", method: "GET" } }, (request, response) => { });
		expect(route3.match(request3)).toBeTrue();

		const request4 = new Request(apiGatewayProxyRequest.good);
		request4.method = "GET";
		request4.version = "01-01-2000";
		request4.path = "/foo/customid/bar/anotherid";
		const route4 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo/:foo/bar/:bar", method: "GET" } }, (request, response) => { });
		expect(route4.match(request4)).toBeTrue();
	});

	it('Test route match parameters build', () => {
		const request1 = new Request(apiGatewayProxyRequest.good);
		request1.method = "GET";
		request1.version = "01-01-2000";
		request1.path = "/customid";
		const route1 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/:foo", method: "GET" } }, (request, response) => { });
		route1.match(request1);
		expect(route1.parameters.foo).toBe("customid");

		const request2 = new Request(apiGatewayProxyRequest.good);
		request2.method = "GET";
		request2.version = "01-01-2000";
		request2.path = "/customid/anotherid";
		const route2 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/:foo/:bar", method: "GET" } }, (request, response) => { });
		route2.match(request2);
		expect(route2.parameters.foo).toBe("customid");
		expect(route2.parameters.bar).toBe("anotherid");

		const request3 = new Request(apiGatewayProxyRequest.good);
		request3.method = "GET";
		request3.version = "01-01-2000";
		request3.path = "/foo/customid/bar/anotherid";
		const route3 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo/:foo/bar/:bar", method: "GET" } }, (request, response) => { });
		route3.match(request3);
		expect(route3.parameters.foo).toBe("customid");
		expect(route3.parameters.bar).toBe("anotherid");

		const request4 = new Request(apiGatewayProxyRequest.goodWithNumber);
		request4.method = "GET";
		request4.version = "01-01-2000";
		request4.path = "/foo/number/1";
		const route4 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo/number/:id", method: "GET" } }, (request, response) => { });
		route4.match(request4);
		expect(route4.parameters.id).toBe("1");
	});

	it('Test route match no parameters build', () => {
		const request = new Request(apiGatewayProxyRequest.good);
		request.method = "GET";
		request.version = "01-01-2000";
		request.path = "/foo";
		const route = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo", method: "GET" } }, (request, response) => { });
		route.match(request);
		expect(route.parameters).toBeObject();
		expect(Object.keys(route.parameters).length).toBe(0);
	});

	it('Test route not match', () => {
		const request1 = new Request(apiGatewayProxyRequest.good);
		request1.method = "GET";
		request1.version = "01-01-2000";
		request1.path = "/customid";
		const route1 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo", method: "GET" } }, (request, response) => { });
		expect(route1.match(request1)).toBeFalse();

		const request2 = new Request(apiGatewayProxyRequest.good);
		request2.method = "GET";
		request2.version = "01-01-2000";
		request2.path = "/customid/anotherid";
		const route2 = new Route({ version: "01-01-2000", action: "Post", request: { method: "POST", path: "/:foo/:bar" } }, (request, response) => { });
		expect(route2.match(request2)).toBeFalse();

		const request3 = new Request(apiGatewayProxyRequest.good);
		request3.method = "GET";
		request3.version = "02-01-2000";
		request3.path = "/foo/customid/bar/anotherid";
		const route3 = new Route({ version: "01-01-2000", action: "Get", request: { path: "/foo/:foo/bar/:bar", method: "GET" } }, (request, response) => { });
		expect(route3.match(request3)).toBeFalse();
	});
});

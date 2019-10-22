const Route = require('../../../../lib/middleware/apiGatewayProxyRest/lib/route');
const Request = require('../../../../lib/middleware/apiGatewayProxyRest/lib/request');
const apiGatewayProxyRequest = require('../../../apiGatewayProxyRequest');

describe('Route', () => {
	it('Test route build instance success', () => {
		expect(() => new Route("GET", { path: "/", action: "Get" }, (request, response) => { })).not.toThrow();
		expect(() => new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => { })).not.toThrow();
		expect(() => new Route("GET", { path: "/", action: "Get" }, (request, response) => { })).not.toThrow();
		expect(() => new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => { })).not.toThrow();
	});

	it('Test route build success property', () => {
		expect(() => new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => { })).not.toThrow();
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
		expect(() => new Route("GET", { path: "/", version: {} }, (request, response) => { })).toThrow();
		expect(() => new Route("GET", { path: "/", action: {} }, (request, response) => { })).toThrow();
	});

	it('Test route access to method', () => {
		const routeGet = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(routeGet.method).toBe("GET");
		const routeDelete = new Route("DELETE", { path: "/", version: "01-01-2000", action: "Delete" }, (request, response) => { });
		expect(routeDelete.method).toBe("DELETE");
	});

	it('Test route access to version', () => {
		const routeVersion = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(routeVersion.version).toBe("01-01-2000");
		const routeDefault = new Route("DELETE", { path: "/", action: "Delete" }, (request, response) => { });
		expect(routeDefault.version).toBe("default");
	});

	it('Test route build route without parameters', () => {
		const route1 = new Route("GET", { path: "/", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route1.routeParameters).toStrictEqual([]);
		const route2 = new Route("GET", { path: "/foo", version: "01-01-2000", action: "GetFoo" }, (request, response) => { });
		expect(route2.routeParameters).toStrictEqual([]);
		const route3 = new Route("GET", { path: "/foo/bar", version: "01-01-2000", action: "GetFooBar" }, (request, response) => { });
		expect(route3.routeParameters).toStrictEqual([]);
	});

	it('Test route build route with parameters', () => {
		const route1 = new Route("GET", { path: "/:foo", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route1.routeParameters[0].keyword).toBe(":foo");
		expect(route1.routeParameters[0].position).toBe(1);
		const route2 = new Route("GET", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route2.routeParameters[0].keyword).toBe(":foo");
		expect(route2.routeParameters[0].position).toBe(1);
		expect(route2.routeParameters[1].keyword).toBe(":bar");
		expect(route2.routeParameters[1].position).toBe(2);

		const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => {
		});
		expect(route3.routeParameters[0].keyword).toBe(":foo");
		expect(route3.routeParameters[0].position).toBe(2);
		expect(route3.routeParameters[1].keyword).toBe(":bar");
		expect(route3.routeParameters[1].position).toBe(4);
	});

	it('Test route build route parameters failure', () => {
		expect(() => new Route("GET", { path: "/:", version: "01-01-2000", action: "Get" }, (request, response) => { })).toThrow();
	});

	it('Test route match', () => {
		const request1 = new Request(apiGatewayProxyRequest.good);
		request1.method = "GET";
		request1.version = "01-01-2000";
		request1.path = "/customid";
		const route1 = new Route("GET", { path: "/:foo", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route1.match(request1)).toBeTrue();

		const request2 = new Request(apiGatewayProxyRequest.good);
		request2.method = "GET";
		request2.version = "01-01-2000";
		request2.path = "/customid/anotherid";
		const route2 = new Route("GET", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route2.match(request2)).toBeTrue();

		const request3 = new Request(apiGatewayProxyRequest.good);
		request3.method = "GET";
		request3.version = "01-01-2000";
		request3.path = "/foo/customid/bar/anotherid";
		const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route3.match(request3)).toBeTrue();

		const request4 = new Request(apiGatewayProxyRequest.good);
		request4.method = "GET";
		request4.version = "01-01-2000";
		request4.path = "/foo/customid/bar/anotherid";
		const route4 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route4.match(request4)).toBeTrue();
	});

	it('Test route match parameters build', () => {
		const request1 = new Request(apiGatewayProxyRequest.good);
		request1.method = "GET";
		request1.version = "01-01-2000";
		request1.path = "/customid";
		const route1 = new Route("GET", { path: "/:foo", version: "01-01-2000", action: "Get" }, (request, response) => { });
		route1.match(request1);
		expect(route1.parameters['foo']).toBe("customid");

		const request2 = new Request(apiGatewayProxyRequest.good);
		request2.method = "GET";
		request2.version = "01-01-2000";
		request2.path = "/customid/anotherid";
		const route2 = new Route("GET", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		route2.match(request2);
		expect(route2.parameters['foo']).toBe("customid");
		expect(route2.parameters['bar']).toBe("anotherid");

		const request3 = new Request(apiGatewayProxyRequest.good);
		request3.method = "GET";
		request3.version = "01-01-2000";
		request3.path = "/foo/customid/bar/anotherid";
		const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		route3.match(request3);
		expect(route3.parameters['foo']).toBe("customid");
		expect(route3.parameters['bar']).toBe("anotherid");

		const request4 = new Request(apiGatewayProxyRequest.goodWithNumber);
		request4.method = "GET";
		request4.version = "01-01-2000";
		request4.path = "/foo/number/1";
		const route4 = new Route("GET", { path: "/foo/number/:id", version: "01-01-2000", action: "Get" }, (request, response) => { });
		route4.match(request4);
		expect(route4.parameters['id']).toBe("1");
	});

	it('Test route match no parameters build', () => {
		const request = new Request(apiGatewayProxyRequest.good);
		request.method = "GET";
		request.version = "01-01-2000";
		request.path = "/foo";
		const route = new Route("GET", { path: "/foo", version: "01-01-2000", action: "Get" }, (request, response) => { });
		route.match(request);
		expect(route.parameters).toBeObject();
		expect(Object.keys(route.parameters).length).toBe(0);
	});

	it('Test route not match', () => {
		const request1 = new Request(apiGatewayProxyRequest.good);
		request1.method = "GET";
		request1.version = "01-01-2000";
		request1.path = "/customid";
		const route1 = new Route("GET", { path: "/foo", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route1.match(request1)).toBeFalse();

		const request2 = new Request(apiGatewayProxyRequest.good);
		request2.method = "GET";
		request2.version = "01-01-2000";
		request2.path = "/customid/anotherid";
		const route2 = new Route("POST", { path: "/:foo/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route2.match(request2)).toBeFalse();

		const request3 = new Request(apiGatewayProxyRequest.good);
		request3.method = "GET";
		request3.version = "02-01-2000";
		request3.path = "/foo/customid/bar/anotherid";
		const route3 = new Route("GET", { path: "/foo/:foo/bar/:bar", version: "01-01-2000", action: "Get" }, (request, response) => { });
		expect(route3.match(request3)).toBeFalse();
	});
});

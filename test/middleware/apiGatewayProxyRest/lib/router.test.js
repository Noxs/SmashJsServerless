const Router = require('../../../../lib/middleware/apiGatewayProxyRest/lib/router');
const Request = require('../../../../lib/middleware/apiGatewayProxyRest/lib/request');
const Response = require('../../../../lib/middleware/apiGatewayProxyRest/lib/response');
const Route = require('../../../../lib/middleware/apiGatewayProxyRest/lib/route');

describe('Router', () => {
	it('Test router instance', () => {
		expect(() => new Router()).not.toThrow();
	});

	it('Test router get', () => {
		const router = new Router();
		expect(router.routes.length).toBe(0);

		const route1 = router.get({ path: "/foo", action: "GetFoo" }, function (request, response) { });
		expect(route1).toBeObject();
		expect(router.routes.length).toBe(1);
		expect(router.routes[0].method).toBe("GET");
		expect(router.routes[0].method).toBe("GET");
		expect(router.routes[0].path).toBe("/foo");
		expect(router.routes[0].path).toBe("/foo");
		expect(router.routes[0].action).toBe("GetFoo");
		expect(router.routes[0].action).toBe("GetFoo");

		const route2 = router.get({ path: "/bar", action: "GetBar" }, function (request, response) { });
		expect(route2).toBeObject();
		expect(router.routes.length).toBe(2);
		expect(router.routes[1].method).toBe("GET");
		expect(router.routes[1].method).toBe("GET");
		expect(router.routes[1].path).toBe("/bar");
		expect(router.routes[1].path).toBe("/bar");
		expect(router.routes[1].action).toBe("GetBar");
		expect(router.routes[1].action).toBe("GetBar");
	});

	it('Test router post', () => {
		const router = new Router();
		expect(router.routes.length).toBe(0);

		const route1 = router.post({ path: "/foo", action: "PostFoo" }, function (request, response) { });
		expect(route1).toBeObject();
		expect(router.routes.length).toBe(1);
		expect(router.routes[0].method).toBe("POST");
		expect(router.routes[0].path).toBe("/foo");

		const route2 = router.post({ path: "/bar", action: "PostBar" }, function (request, response) { });
		expect(route2).toBeObject();
		expect(router.routes.length).toBe(2);
		expect(router.routes[1].method).toBe("POST");
		expect(router.routes[1].path).toBe("/bar");
	});

	it('Test router put', () => {
		const router = new Router();
		expect(router.routes.length).toBe(0);

		const route1 = router.put({ path: "/foo", action: "PutFoo" }, function (request, response) { });
		expect(route1).toBeObject();
		expect(router.routes.length).toBe(1);
		expect(router.routes[0].method).toBe("PUT");
		expect(router.routes[0].path).toBe("/foo");

		const route2 = router.put({ path: "/bar", action: "PutBar" }, function (request, response) { });
		expect(route2).toBeObject();
		expect(router.routes.length).toBe(2);
		expect(router.routes[1].method).toBe("PUT");
		expect(router.routes[1].path).toBe("/bar");
	});

	it('Test router delete', () => {
		const router = new Router();
		expect(router.routes.length).toBe(0);

		const route1 = router.delete({ path: "/foo", action: "DeleteFoo" }, function (request, response) { });
		expect(route1).toBeObject();
		expect(router.routes.length).toBe(1);
		expect(router.routes[0].method).toBe("DELETE");
		expect(router.routes[0].path).toBe("/foo");

		const route2 = router.delete({ path: "/bar", action: "DeleteBar" }, function (request, response) { });
		expect(route2).toBeObject();
		expect(router.routes.length).toBe(2);
		expect(router.routes[1].method).toBe("DELETE");
		expect(router.routes[1].path).toBe("/bar");
	});

	it('Test router patch', () => {
		const router = new Router();
		expect(router.routes.length).toBe(0);

		const route1 = router.patch({ path: "/foo", action: "PatchFoo" }, function (request, response) { });
		expect(route1).toBeObject();
		expect(router.routes.length).toBe(1);
		expect(router.routes[0].method).toBe("PATCH");
		expect(router.routes[0].path).toBe("/foo");

		const route2 = router.patch({ path: "/bar", action: "PatchBar" }, function (request, response) { });
		expect(route2).toBeObject();
		expect(router.routes.length).toBe(2);
		expect(router.routes[1].method).toBe("PATCH");
		expect(router.routes[1].path).toBe("/bar");
	});

	it('Test router options', () => {
		const router = new Router();
		expect(router.routes.length).toBe(0);

		const route1 = router.options({ path: "/foo", action: "OptionsFoo" }, function (request, response) { });
		expect(route1).toBeObject();
		expect(router.routes.length).toBe(1);
		expect(router.routes[0].method).toBe("OPTIONS");
		expect(router.routes[0].path).toBe("/foo");

		const route2 = router.options({ path: "/bar", action: "OptionsBar" }, function (request, response) { });
		expect(route2).toBeObject();
		expect(router.routes.length).toBe(2);
		expect(router.routes[1].method).toBe("OPTIONS");
		expect(router.routes[1].path).toBe("/bar");
	});

	it('Test router head', () => {
		const router = new Router();
		expect(router.routes.length).toBe(0);

		const route1 = router.head({ path: "/foo", action: "HeadFoo" }, function (request, response) { });
		expect(route1).toBeObject();
		expect(router.routes.length).toBe(1);
		expect(router.routes[0].method).toBe("HEAD");
		expect(router.routes[0].path).toBe("/foo");

		const route2 = router.head({ path: "/bar", action: "HeadBar" }, function (request, response) { });
		expect(route2).toBeObject();
		expect(router.routes.length).toBe(2);
		expect(router.routes[1].method).toBe("HEAD");
		expect(router.routes[1].path).toBe("/bar");
	});

	it('Test handle request success', () => {
		const router = new Router();
		//TODO
	});

	it('Test handle request fail', () => {
		const router = new Router();
		//TODO
	});
});

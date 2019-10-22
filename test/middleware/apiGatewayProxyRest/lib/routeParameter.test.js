const RouteParameter = require('../../../../lib/middleware/apiGatewayProxyRest/lib/routeParameter');

describe('RouteParameter', () => {
	it('Test RouteParameter build success', () => {
		const parameter = new RouteParameter("test", 0);
		expect(parameter.keyword).toBe("test");
		expect(parameter.position).toBe(0);
	});

	it('Test RouteParameter build failure', () => {
		expect(() => new RouteParameter()).toThrow();
		expect(() => new RouteParameter({}, {})).toThrow();
		expect(() => new RouteParameter("test", {})).toThrow();
		expect(() => new RouteParameter({}, 0)).toThrow();
	});
});

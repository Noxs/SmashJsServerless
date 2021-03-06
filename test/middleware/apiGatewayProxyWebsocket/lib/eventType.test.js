const EventType = require('../../../../lib/middleware/apiGatewayProxyWebsocket/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const route = {};
		expect(() => new EventType(route)).toThrow();
		route.keyword = "";
		expect(() => new EventType(route)).toThrow();
		const badCallback = () => { };
		expect(() => new EventType(route, badCallback)).toThrow();
	});

	it('Test event instance success', () => {
		const route = { keyword: "foobar" };
		const callback = param => { };
		expect(() => new EventType(route, callback)).not.toThrow();
	});

	it('Test event get keyword', () => {
		const route = { keyword: "foobar" };
		const callback = param => { };
		const eventType = new EventType(route, callback);
		expect(eventType.keyword).toEqual("foobar");
	});

	it('Test event match success not match', () => {
		const route = { keyword: "" };
		const callback = param => { };
		const eventType = new EventType(route, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const route = { keyword: "TestAction" };
		const callback = param => { };
		const eventType = new EventType(route, callback);
		const event = { keyword: "TestAction" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const route = { keyword: "" };
		const callback = param => { };
		const eventType = new EventType(route, callback);
		expect(eventType.callback).toBeFunction();
	});
});

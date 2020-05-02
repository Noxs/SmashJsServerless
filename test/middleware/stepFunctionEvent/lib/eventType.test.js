const EventType = require('../../../../lib/middleware/stepFunctionEvent/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const route = {};
		expect(() => new EventType(route)).toThrow();
		route.channel = "";
		expect(() => new EventType(route)).toThrow();
		const badCallback = () => { };
		expect(() => new EventType(route, badCallback)).toThrow();
	});

	it('Test event instance success', () => {
		const route = { name: "foobar" };
		const callback = param => param;
		expect(() => new EventType(route, callback)).not.toThrow();
	});

	it('Test event get name', () => {
		const route = { name: "foobar" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		expect(eventType.name).toBe("foobar");
	});

	it('Test event match success not match', () => {
		const route = { name: "" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const route = { name: "TestAction" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = { name: "TestAction" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const route = { name: "" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		expect(eventType.callback).toBeFunction();
	});
});

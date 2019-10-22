const EventType = require('../../../../lib/middleware/cloudWatchEvent/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const route = { source: "", version: "" };
		expect(() => new EventType(route)).toThrow();
	});

	it('Test event instance success', () => {
		const route = { source: "", version: "" };
		const callback = param => param;
		expect(() => new EventType(route, callback)).not.toThrow();
	});

	it('Test event match success not match', () => {
		const route = { source: "", version: "" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const route = { source: "test", version: "1" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = { source: "test", version: "1" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const route = { source: "", version: "" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		expect(eventType.callback).toBeFunction();
	});
});

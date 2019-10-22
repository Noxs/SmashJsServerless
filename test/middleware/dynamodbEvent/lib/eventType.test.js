const EventType = require('../../../../lib/middleware/dynamodbEvent/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const route = { type: "", table: "" };
		expect(() => new EventType(route)).toThrow();
	});

	it('Test event instance success', () => {
		const route = { type: "", table: "" };
		const callback = param => param;
		expect(() => new EventType(route, callback)).not.toThrow();
	});

	it('Test event match success not match', () => {
		const route = { type: "", table: "" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const route = { type: "INSERT", table: "foobar" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = { type: "INSERT", table: "foobar" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const route = { type: "", table: "" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		expect(eventType.callback).toBeFunction();
	});
});

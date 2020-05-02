const EventType = require('../../../../lib/middleware/kinesisAnalyticsProcessor/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const stream = {};
		expect(() => new EventType(stream)).toThrow();
		stream.channel = "";
		expect(() => new EventType(stream)).toThrow();
		const badCallback = () => { };
		expect(() => new EventType(stream, badCallback)).toThrow();
	});

	it('Test event instance success', () => {
		const stream = { application: "foobar" };
		const callback = param => param;
		expect(() => new EventType(stream, callback)).not.toThrow();
	});

	it('Test event get application', () => {
		const stream = { application: "foobar" };
		const callback = param => param;
		const eventType = new EventType(stream, callback);
		expect(eventType.application).toBe("foobar");
	});

	it('Test event match success not match', () => {
		const stream = { application: "" };
		const callback = param => param;
		const eventType = new EventType(stream, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const stream = { application: "TestAction" };
		const callback = param => param;
		const eventType = new EventType(stream, callback);
		const event = { application: "TestAction" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const stream = { application: "" };
		const callback = param => param;
		const eventType = new EventType(stream, callback);
		expect(eventType.callback).toBeFunction();
	});
});

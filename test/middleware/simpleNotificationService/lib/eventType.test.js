const EventType = require('../../../../lib/middleware/simpleNotificationService/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const notification = {};
		expect(() => new EventType(notification)).toThrow();
		notification.channel = "";
		expect(() => new EventType(notification)).toThrow();
		const badCallback = () => { };
		expect(() => new EventType(notification, badCallback)).toThrow();
	});

	it('Test event instance success', () => {
		const notification = { channel: "foobar" };
		const callback = param => param;
		expect(() => new EventType(notification, callback)).not.toThrow();
	});

	it('Test event get channel', () => {
		const notification = { channel: "foobar" };
		const callback = param => param;
		const eventType = new EventType(notification, callback);
		expect(eventType.channel).toBe("foobar");
	});

	it('Test event match success not match', () => {
		const notification = { channel: "" };
		const callback = param => param;
		const eventType = new EventType(notification, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const notification = { channel: "TestAction" };
		const callback = param => param;
		const eventType = new EventType(notification, callback);
		const event = { channel: "TestAction" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const notification = { channel: "" };
		const callback = param => param;
		const eventType = new EventType(notification, callback);
		expect(eventType.callback).toBeFunction();
	});
});

const EventType = require('../../../../lib/middleware/kinesisAnalytics/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const kinesisApp = {};
		expect(() => new EventType(kinesisApp)).toThrow();
		kinesisApp.channel = "";
		expect(() => new EventType(kinesisApp)).toThrow();
		const badCallback = () => { };
		expect(() => new EventType(kinesisApp, badCallback)).toThrow();
	});

	it('Test event instance success', () => {
		const kinesisApp = { application: "foobar" };
		const callback = param => param;
		expect(() => new EventType(kinesisApp, callback)).not.toThrow();
	});

	it('Test event get application', () => {
		const kinesisApp = { application: "foobar" };
		const callback = param => param;
		const eventType = new EventType(kinesisApp, callback);
		expect(eventType.application).toBe("foobar");
	});

	it('Test event match success not match', () => {
		const kinesisApp = { application: "" };
		const callback = param => param;
		const eventType = new EventType(kinesisApp, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const kinesisApp = { application: "TestAction" };
		const callback = param => param;
		const eventType = new EventType(kinesisApp, callback);
		const event = { application: "TestAction" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const kinesisApp = { application: "" };
		const callback = param => param;
		const eventType = new EventType(kinesisApp, callback);
		expect(eventType.callback).toBeFunction();
	});
});

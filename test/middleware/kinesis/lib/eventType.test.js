const EventType = require('../../../../lib/middleware/kinesis/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const kinesisStream = {};
		expect(() => new EventType(kinesisStream)).toThrow();
		kinesisStream.channel = "";
		expect(() => new EventType(kinesisStream)).toThrow();
		const badCallback = () => { };
		expect(() => new EventType(kinesisStream, badCallback)).toThrow();
	});

	it('Test event instance success', () => {
		const kinesisStream = { stream: "foobar" };
		const callback = param => param;
		expect(() => new EventType(kinesisStream, callback)).not.toThrow();
	});

	it('Test event get stream', () => {
		const kinesisStream = { stream: "foobar" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		expect(eventType.stream).toBe("foobar");
	});

	it('Test event match success not match', () => {
		const kinesisStream = { stream: "" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const kinesisStream = { stream: "TestAction" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		const event = { stream: "TestAction" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const kinesisStream = { stream: "" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		expect(eventType.callback).toBeFunction();
	});
});

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
		const kinesisStream = { name: "foobar" };
		const callback = param => param;
		expect(() => new EventType(kinesisStream, callback)).not.toThrow();
	});

	it('Test event get name', () => {
		const kinesisStream = { name: "foobar" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		expect(eventType.name).toBe("foobar");
	});

	it('Test event match success not match', () => {
		const kinesisStream = { name: "" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		const event = {};
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match success match', () => {
		const kinesisStream = { name: "TestAction" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		const event = { name: "TestAction" };
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const kinesisStream = { name: "" };
		const callback = param => param;
		const eventType = new EventType(kinesisStream, callback);
		expect(eventType.callback).toBeFunction();
	});
});

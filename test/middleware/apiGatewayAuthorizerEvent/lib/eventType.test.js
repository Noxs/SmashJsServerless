const EventType = require('../../../../lib/middleware/apiGatewayAuthorizerEvent/lib/eventType');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
	});

	it('Test event instance success', () => {
		const callback = param => param;
		expect(() => new EventType(callback)).not.toThrow();
	});

	it('Test event match success', () => {
		const callback = param => param;
		const eventType = new EventType(callback);
		const event = {};
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event callback', () => {
		const callback = param => param;
		const eventType = new EventType(callback);
		expect(eventType.callback).toBeFunction();
	});
});

const EventType = require('../../../../lib/middleware/codePipelineJobEvent/lib/eventType.js');
const codePipeline = require('../../../codePipelineJobEvent.js');

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
		const event = codePipeline.good;
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event match success with route', () => {
		const route = { task: "dataStackDeploy" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = codePipeline.goodgood;
		expect(eventType.match(event)).toBeTrue();
	});

	it('Test event match failure', () => {
		const callback = param => param;
		const eventType = new EventType(callback);
		const event = codePipeline.bad;
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event match failure with route', () => {
		const route = { task: "dataStackDeploy" };
		const callback = param => param;
		const eventType = new EventType(route, callback);
		const event = codePipeline.badbad;
		expect(eventType.match(event)).toBeFalse();
	});

	it('Test event callback', () => {
		const callback = param => param;
		const eventType = new EventType(callback);
		expect(eventType.callback).toBeFunction();
	});
});

const Event = require('../../../../lib/middleware/cloudWatchEvent/lib/event.js');


describe('Event', () => {
	it('Test event instance failure', () => {
		expect(() => new Event()).toThrow();
		const rawEvent = {};
		expect(() => new Event(rawEvent)).toThrow();
		const context = {};
		const terminateObject = {};
		expect(() => new Event(rawEvent, context, terminateObject)).toThrow();
		const terminate = { terminate: () => { } };
		expect(() => new Event(rawEvent, context, terminate)).toThrow();
	});

	it('Test event instance success', () => {
		const rawEvent = {};
		const context = {};
		const terminate = { terminate: (error, data) => { } };
		expect(() => new Event(rawEvent, context, terminate)).not.toThrow();
	});

	it('Test event success', done => {
		const rawEvent = {};
		const context = {};
		const terminate = {
			terminate: (error, data) => {
				expect(error).toBe(null);
				expect(data).not.toBe(null);
				done();
			},
		};
		const event = new Event(rawEvent, context, terminate);
		event.success();
	});

	it('Test event failure', done => {
		const rawEvent = {};
		const context = {};
		const terminate = {
			terminate: (error, data) => {
				expect(error).not.toBe(null);
				expect(data).toBe(null);
				done();
			},
		};
		const event = new Event(rawEvent, context, terminate);
		event.failure(new Error("Foobar"));
	});

	it('Test event terminate', done => {
		const rawEvent = {};
		const context = {};
		const terminate = {
			terminate: (error, data) => {
				expect(error).toBe(null);
				expect(data).toBe(undefined);
				done();
			},
		};
		const event = new Event(rawEvent, context, terminate);
		event.terminate(null);
	});
});



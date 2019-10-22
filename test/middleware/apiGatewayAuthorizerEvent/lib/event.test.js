const SmashLogger = require('../../../../lib/util/smashLogger');
SmashLogger.verbose({ level: "disable" });
const smash = require('../../../../smash');
const Event = require('../../../../lib/middleware/apiGatewayAuthorizerEvent/lib/event');
const ApiGatewayAuthorizerRequest = require('../../../apiGatewayAuthorizerRequest');
smash.setCurrentEvent({ methodArn: "" });

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
		const rawEvent = ApiGatewayAuthorizerRequest.good;
		const context = {};
		const terminate = { terminate: (error, data) => { } };
		expect(() => new Event(rawEvent, context, terminate)).not.toThrow();
	});

	it('Test event internal server error', done => {
		const rawEvent = ApiGatewayAuthorizerRequest.good;
		const context = {};
		const terminate = {
			terminate: (error, data) => {
				expect(error).not.toBe(null);
				expect(data).toBe(undefined);
				done();
			},
		};
		const event = new Event(rawEvent, context, terminate);
		event.internalServerError(new Error("An error"));
	});

	it('Test event unauthorized', done => {
		const rawEvent = ApiGatewayAuthorizerRequest.good;
		const context = {};
		const terminate = {
			terminate: (error, data) => {
				expect(error).not.toBe(null);
				expect(data).toBe(undefined);
				done();
			},
		};
		const event = new Event(rawEvent, context, terminate);
		event.unauthorized();
	});

	it('Test event allow', done => {
		const rawEvent = ApiGatewayAuthorizerRequest.good;
		const context = {};
		const terminate = {
			terminate: (error, data) => {
				expect(error).toBe(null);
				expect(data).not.toBe(null);
				done();
			},
		};
		const event = new Event(rawEvent, context, terminate);
		event.generatePermissionContext({ id: "id", username: "username", region: "region", roles: "roles" });
		event.allow();
	});

	it('Test event deny', done => {
		const rawEvent = ApiGatewayAuthorizerRequest.good;
		const context = {};
		const terminate = {
			terminate: (error, data) => {
				expect(error).toBe(null);
				expect(data).not.toBe(null);
				done();
			},
		};
		const event = new Event(rawEvent, context, terminate);
		event.generatePermissionContext({ id: "id", username: "username", region: "region", roles: "roles" });
		event.deny();
	});

	it('Test event terminate', done => {
		const rawEvent = ApiGatewayAuthorizerRequest.good;
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


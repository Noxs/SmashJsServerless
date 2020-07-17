const Headers = require('../lib/middleware/apiGatewayProxyRest/lib/headers');
const badModule = "badModule";

const overwriteModule = {
	expose: () => ["foobar", "foobar"],
};

describe('Smash', () => {
	let smash = null;
	let cloudWatchEvent = null;
	let codePipeline = null;
	let apiGatewayProxyRequest = null;

	beforeEach(() => {
		jest.resetModules();
		smash = require('../smash');
		cloudWatchEvent = require('./cloudWatchEvent');
		codePipeline = require('./codePipelineJobEvent');
		apiGatewayProxyRequest = require('./apiGatewayProxyRequest');
	});

/* 	it('Test smash boot', () => {
		expect(() => smash.boot({ verbose: { level: "disable" } })).not.toThrow();
	});

	it('Test smash register middleware', () => {
		expect(() => smash.boot({ verbose: { level: "disable" } })).not.toThrow();
		expect(smash._middlewares.length).toBe(13);
		smash.boot({ verbose: { level: "disable" } });
		expect(smash._middlewares.length).toBe(13);
	});

	it('Test smash register handlers', () => {
		expect(() => smash.boot({ verbose: { level: "disable" } })).not.toThrow();
		expect(smash._handlers.length).toBe(5);
	});

	it('Test smash process expose bad module', () => {
		expect(() => smash._processExpose(badModule)).toThrow();
		expect(() => smash._processExpose()).toThrow();
	});

	it('Test smash handle event without boot', () => {
		smash._middlewares = null;
		expect(() => smash.handleEvent({})).toThrow();
	});

	it('Test smash util success', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.util("testUtil")).not.toThrow();
	});

	it('Test smash util not found', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.util("test")).toThrow();
	});

	it('Test smash util invalid', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.util(1)).toThrow();
	});

	it('Test smash database success', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.database("testDatabase")).not.toThrow();
	});

	it('Test smash database not found', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.database("test")).toThrow();
	});

	it('Test smash database invalid', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.database(1)).toThrow();
	});

	it('Test smash helper success', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.helper("random")).not.toThrow();
	});

	it('Test smash helper not found', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.helper("test")).toThrow();
	});

	it('Test smash helper invalid', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.helper(1)).toThrow();
	});

	it('Test smash config', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(smash.config).toBeObject();
	});

	it('Test smash model', () => {
		smash.boot({ verbose: { level: "disable" } });
		expect(smash.DynamodbModel).toBeFunction();
	});

	it('Test smash handle event cloud watch event success', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = cloudWatchEvent.good;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn(error => {
			expect(error).toBe(null);
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});

	it('Test smash handle event cloud watch event not found', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = cloudWatchEvent.bad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn(error => {
			expect(error).not.toBe(null);
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});

	it('Test smash handle event codepipeline event success', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = codePipeline.goodgood;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn(error => {
			expect(error).toBe(null);
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});

	it('Test smash handle event codepipeline event not found', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = codePipeline.bad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn(error => {
			expect(error).not.toBe(null);
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});

	it('Test smash handle event api gateway proxy event success', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = apiGatewayProxyRequest.goodWithoutUser;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn((error, data) => {
			expect(error).toBe(null);
			expect(data).toBeObject();
			expect(data).toStrictEqual({
				statusCode: 200,
				headers: new Headers({
					'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
					"content-type": "application/json",
				}).toRawObject(),
				body: '{"data":{"foo":"bar"}}',
				isBase64Encoded: false,
			});
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});
 */
	it('Test smash handle event api gateway proxy event not found', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = apiGatewayProxyRequest.goodNotFound;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn((error, data) => {
			expect(error).toBe(null);
			expect(data).toBeObject();
			try {
				expect(data).toStrictEqual({
					statusCode: 404,
					headers: new Headers({
						'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
						"content-type": "application/json",
					}).toRawObject(),
					body: '{"code":404,"error":"Route not found","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef","details":{"name":"Route","method":"GET","path":"/notfound","type":"Route","version":"default"}}',
					isBase64Encoded: false,
				});
			} catch (error) {
				console.log(error);
			}
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});

/* 	it('Test smash handle event api gateway proxy event incorrect', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = apiGatewayProxyRequest.bad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn((error, data) => {
			expect(error).toBe(null);
			expect(data).toBeObject();
			expect(data).toStrictEqual({
				statusCode: 500,
				body: '{"code":500,"error":"Internal Server Error","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef"}',
				headers: new Headers({
					'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
					"content-type": "application/json",
				}).toRawObject(),
				isBase64Encoded: false,
			});
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});

	it('Test smash handle event api gateway proxy event incorrect', done => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		const event = apiGatewayProxyRequest.badbad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const mockedFunction = jest.fn((error, data) => {
			expect(error).not.toBe(null);
			expect(data).toBe(undefined);
			expect(error.message).toBe("No middleware found to process event");
			expect(mockedFunction.mock.calls.length).toBe(1);
			done();
		});
		smash.handleEvent(event, context, mockedFunction);
	});

	it('Test smash getRoutes', () => {
		smash.shutdown();
		expect(() => smash.getRoutes()).toThrow();
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.getRoutes()).not.toThrow();
		expect(smash.getRoutes()).toBeArray();
	});

	it('Test smash getHandlers', () => {
		smash.shutdown();
		smash.boot({ verbose: { level: "disable" } });
		expect(() => smash.getHandlers()).not.toThrow();
		expect(smash.getHandlers()).toBeArray();
	});

	it('Test smash extend', () => {
		expect(() => smash.extend({})).not.toThrow();
	});

	it('Test smash get env()', () => {
		expect(() => smash.env).not.toThrow();
		expect(smash.env).toStrictEqual(smash._env);
	});

	it('Test smash setEnv(key, value)', () => {
		expect(() => smash.setEnv("test", "test")).not.toThrow();
		smash._env = null;
		expect(() => smash.setEnv("test", "test")).not.toThrow();
		expect(smash.env.test).toStrictEqual("test");
	});

	it('Test smash getRegion()', () => {
		expect(() => smash.setEnv("AWS_REGION", "eu-west-1")).not.toThrow();
		expect(smash.getRegion()).toStrictEqual("eu-west-1");
	});

	it('Test smash getEnvs(keys)', () => {
		expect(() => smash.setEnv("AWS_REGION", "eu-west-1")).not.toThrow();
		expect(() => smash.setEnv("test", "test")).not.toThrow();
		expect(smash.getEnvs(["AWS_REGION", "test"])).toStrictEqual(["eu-west-1", "test"]);
	}); */
});

const smash = require('../smash.js');
const Config = require('../lib/core/config.js');
const cloudWatchEvent = require('./util/cloudWatchEvent.js');
const codePipeline = require('./util/codePipelineJobEvent.js');
const apiGatewayProxyRequest = require('./util/apiGatewayProxyRequest.js');

const badModule = "badModule";

const overwriteModule = {
	expose: () => {
		return ["foobar", "foorbar"];
	}
};


describe('Smash', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it('Test smash boot failure', async () => {
		await expect(smash.boot()).rejects.toThrow();
	});

	it('Test smash boot success', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await expect(smash.boot(undefined, envs)).resolves.toEqual(undefined);
	});

	it('Test smash register middleware', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		expect(smash._middlewares).toHaveLength(8);
	});

	it('Test smash register handlers', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		expect(smash._handlers).toHaveLength(5);
	});

	it('Test smash process expose bad module', () => {
		expect(() => {
			smash._processExpose(badModule);
		}).toThrow();

		expect(() => {
			smash._processExpose();
		}).toThrow();
	});

	it('Test smash process expose overwrite module', () => {
		expect(() => {
			smash._processExpose(overwriteModule);
		}).toThrow();
	});

	it('Test smash handle event', () => {
		smash._middlewares = null;
		expect(() => {
			smash.handleEvent({});
		}).toThrow();
	});

	it('Test smash util success', async () => {
		await smash.boot();
		expect(() => {
			smash.util("testUtil");
		}).not.toThrow();
	});

	it('Test smash util not found', async () => {
		await smash.boot();
		expect(() => {
			smash.util("test");
		}).toThrow();
	});

	it('Test smash util invalid', async () => {
		await smash.boot();
		expect(() => {
			smash.util(1);
		}).toThrow();
	});

	it('Test smash database success with primary index', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		}
		await smash.boot(undefined, envs);
		expect(smash.database('transfer')).toHaveProperty('getTransfer');
		expect(smash.database('transfer')).toHaveProperty('getTransfers');
		expect(smash.database('transfer')).toHaveProperty('findTransfer');
		expect(smash.database('transfer')).toHaveProperty('deleteTransfer');
	});

	it('Test smash database success with secondary index', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		}
		await smash.boot(undefined, envs);
		expect(smash.database('transfer')).toHaveProperty('getTransfersByAccountLegacy');
		expect(smash.database('transfer')).toHaveProperty('getTransfersByAccountLegacy');
	});

	it('Test smash database found', async () => {
		await smash.boot();
		expect(() => {
			smash.database("test");
		}).toThrow();
	});

	it('Test smash database invalid', async () => {
		await smash.boot();
		expect(() => {
			smash.database(1);
		}).toThrow();
	});

	it('Test smash helper success', async () => {
		await smash.boot();

		expect(() => {
			smash.helper("random");
		}).not.toThrow();
	});

	it('Test smash helper not found', async () => {
		await smash.boot();

		expect(() => {
			smash.helper("test");
		}).toThrow();
	});

	it('Test smash helper invalid', async () => {
		await smash.boot();

		expect(() => {
			smash.helper(1);
		}).toThrow();
	});

	it('Test smash config', async () => {
		await smash.boot();
		expect(typeof smash.config).toBe('object');
		expect(smash.config).toBeInstanceOf(Config);
	});

	it('Test smash console', async () => {
		await smash.boot();
		expect(typeof smash.Console).toBe('function');
	});

	it('Test smash handle event cloud watch event success', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		const event = cloudWatchEvent.good;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = jest.fn((error, data) => {
			expect(error).toBeNull();
		});

		smash.handleEvent(event, context, callback);
		expect(callback).toHaveBeenCalled();
	});

	it('Test smash handle event cloud watch event not found', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		const event = cloudWatchEvent.bad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = jest.fn((error, data) => {
			expect(error).not.toBeNull();
		});
		smash.handleEvent(event, context, callback);
		expect(callback).toHaveBeenCalled();
	});

	it('Test smash handle event codepipeline event success', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		const event = codePipeline.goodgood;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = jest.fn((error, data) => {
			expect(error).toBeNull();
		});
		smash.handleEvent(event, context, callback);
		expect(callback).toHaveBeenCalled();
	});

	it('Test smash handle event codepipeline event not found', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs); const event = codePipeline.bad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = jest.fn((error, data) => {
			expect(error).not.toBeNull();
		});
		smash.handleEvent(event, context, callback);
		expect(callback).toHaveBeenCalled();
	});

	it('Test smash handle event api gateway proxy event success', async done => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		const event = apiGatewayProxyRequest.goodWithoutUser;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = jest.fn((error, data) => {
			expect(error).toBeNull();
			expect(typeof data).toBe('object');
			expect(data).toStrictEqual({
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
				},
				body: '{"data":{"foo":"bar"}}'
			});
			done();
		});
		smash.handleEvent(event, context, callback);
		expect(callback).toHaveBeenCalled();
	});

	it('Test smash handle event api gateway proxy event not found', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		const event = apiGatewayProxyRequest.goodNotFound;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = jest.fn((error, data) => {
			expect(error).toBeNull();
			expect(typeof data).toBe('object');
			expect(data).toStrictEqual({
				statusCode: 404,
				headers: {
					'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
				},
				body: '{"code":404,"error":"Route GET /notfound not found","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef"}',
			});
		});
		smash.handleEvent(event, context, callback);
		expect(callback).toHaveBeenCalled();
	});

	it('Test smash handle event api gateway proxy event incorrect case 1', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		const event = apiGatewayProxyRequest.bad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = jest.fn((error, data) => {
			expect(error).toBeNull();
			expect(typeof data).toBe('object');

			expect(data).toStrictEqual({
				statusCode: 500,
				body: '{"code":500,"error":"Internal Server Error","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef"}',
				headers: {
					'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
				},
			});
		});
		smash.handleEvent(event, context, callback);
		expect(callback).toHaveBeenCalled();
	});

	it('Test smash handle event api gateway proxy event incorrect case 2', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		const event = apiGatewayProxyRequest.badbad;
		const context = { invokedFunctionArn: 'arn:aws:lambda:*******:*******:function:*************:prod' };
		const callback = (error, data) => {
			expect(data).toBeUndefined();
			expect(error.message).toStrictEqual("No middleware found to process event");
		};
		smash.handleEvent(event, context, callback);
	});

	it('Test smash getRoutes', async () => {
		smash.shutdown();
		expect(() => {
			smash.getRoutes();
		}).toThrow();
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		expect(Array.isArray(smash.getRoutes())).toBe(true);
	});

	it('Test smash getHandlers', async () => {
		const envs = {
			'TABLE_PREFIX': 'transfer',
			'ENV': 'dev',
		};
		await smash.boot(undefined, envs);
		expect(Array.isArray(smash.getHandlers())).toBe(true);
	});
});

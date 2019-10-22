const Config = require('../../lib/core/config.js');
const fs = require('fs');
const path = require('path');

const configTest = {
	"apiGatewayProxy": {
		"response": {
			"headers": {
				"default": {
					"Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
				},
			},
		},
	},
	"codePipelineJobEvent": {},
	"cloudWatchEvent": {},
	"dynamodb": {
		"tableSuffix": {
			"dev": "_dev",
		},
	},
};

describe('Config', () => {
	it('Test config instance failure', () => {
		Object.keys(require.cache).forEach(key => {
			delete require.cache[key];
		});
		fs.renameSync(path.resolve(path.join(process.cwd(), "config.json")), path.resolve(path.join(process.cwd(), "config1.json")));
		expect(() => new Config()).toThrow();
		fs.renameSync(path.resolve(path.join(process.cwd(), "config1.json")), path.resolve(path.join(process.cwd(), "config.json")));
	});

	it('Test config instance success', () => {
		expect(() => new Config()).not.toThrow();
	});

	it('Test config value access', () => {
		const config = new Config();
		expect(config.get()).toStrictEqual(configTest);
		expect(config.get("apiGatewayProxy.response")).toStrictEqual(configTest.apiGatewayProxy.response);
		expect(config.get("apiGatewayProxy.response.headers")).toStrictEqual(configTest.apiGatewayProxy.response.headers);
		expect(config.get("apiGatewayProxy.response.notexist")).toStrictEqual(undefined);
	});

	it('Test config by string failure', () => {
		const config = new Config();
		expect(() => config._byString(1)).toThrow();
	});

	it('Test config get bad argument', () => {
		const config = new Config();
		expect(() => config.get(1)).toThrow();
	});
});

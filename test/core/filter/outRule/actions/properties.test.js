const { PROPERTIES } = require("../../../../../lib/core/filter/constant");

describe('Properties', () => {
	let properties = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/outRule/outRuleProcessor");
		properties = require("../../../../../lib/core/filter/outRule/actions/properties");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(properties.name).toBe(PROPERTIES);
		expect(properties.execute).toBeFunction();
		expect(properties.validate).toBeFunction();
		expect(properties.config).toBeObject();
	});


	it('Test validate case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "userInput",
				validate: mockedFunction,
			},
		];
		expect(properties.validate({
			current: {
				name: "properties",
				value: { test: { type: "string" } },
			},
			rule: { properties: { test: { type: "string" } } },
			parents: [
				{
					name: "none",
					value: { properties: { test: { type: "string" } } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "userInput",
				validate: mockedFunction,
			},
		];
		expect(properties.validate({
			current: {
				name: "properties",
				value: { myValue: { type: "string" } },
			},
			rule: { properties: { test: { type: "object", properties: { myValue: { type: "string" } } } } },
			parents: [
				{
					name: "none",
					value: { properties: { test: { type: "object", properties: { myValue: { type: "string" } } } } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
		})).toBe(true);
	});

	it('Test validate case #3', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "userInput",
				validate: mockedFunction,
			},
		];
		expect(properties.validate({
			current: {
				name: "properties",
				value: { myValue: { type: "string" } },
			},
			rule: { properties: { test: { type: "array", properties: { type: "string" } } } },
			parents: [
				{
					name: "none",
					value: { properties: { test: { type: "array", properties: { type: "string" } } } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
		})).toBe(true);
	});

	it('Test validate case #4', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			}
		];
		expect(() => {
			return properties.validate({
				current: {
					name: "properties",
					value: { test: { type: "string" }, type: "foorbar" },
				},
				rule: { properties: { test: { type: "string" }, type: "foorbar" } },
				parents: [
					{
						name: "none",
						value: { properties: { test: { type: "string" }, type: "foorbar" } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			});
		}).toThrow();
	});

	it('Test validate case #5', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			}
		];
		expect(() => {
			return properties.validate({
				current: {
					name: "properties",
					value: "foobar",
				},
				rule: { properties: "foobar" },
				parents: [
					{
						name: "none",
						value: { properties: "foobar" },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			});
		}).toThrow();
	});

	it('Test validate case #6', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return properties.validate({
				current: {
					name: "body",
					value: "foobar",
				},
				rule: { body: "foobar" },
				parents: [
					{
						name: "none",
						value: { body: "foobar" },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const mockedFunction = jest.fn(() => {
			return new Promise(resolve => {
				resolve(true);
			});
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "userInput",
				execute: mockedFunction,
				priority: 50,
			},
		];
		await expect(properties.execute({
			rule: {
				current: {
					name: "properties",
					value: { foo: {}, bar: {} },
				},
				initalRule: { properties: { foor: {}, bar: {} } },
				parents: [
					{
						name: "none",
						value: { properties: { foor: {}, bar: {} } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			},
			data: {
				current: { name: "none", value: { foo: "bar", bar: "foo" } },
				initialData: { foo: "bar", bar: "foo" },
				parents: [{ name: "none", value: { foo: "bar", bar: "foo" } }],
			},
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(2);
	});

	it('Test execute case #2', async () => {
		const mockedFunction = jest.fn(() => {
			return new Promise(resolve => {
				resolve(true);
			});
		});
		const processor = new RuleProcessor("outRule");
		processor.modules = [
			{
				name: "userInput",
				execute: mockedFunction,
				priority: 50,
			},
		];
		const data = {
			current: { name: "none", value: { foo: "bar", bar: "foo" } },
			initialData: { foo: "bar", bar: "foo" },
			parents: [{ name: "none", value: { foo: "bar", bar: "foo" } }],
			mode: "permissive",
		};
		await expect(properties.execute({
			rule: {
				current: {
					name: "properties",
					value: { foo: {}, bar: {} },
				},
				initalRule: { properties: { foo: {}, bar: {} }, mode: "permissive" },
				parents: [
					{
						name: "none",
						value: { properties: { foo: {}, bar: {} }, mode: "permissive" },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			},
			data,
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(0);
		expect(data.initialData).toStrictEqual({});
	});
});


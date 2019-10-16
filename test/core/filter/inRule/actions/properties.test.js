const { PROPERTIES } = require("../../../../../lib/core/filter/constant");

describe('Properties', () => {
	let properties = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/inRule/inRuleProcessor");
		properties = require("../../../../../lib/core/filter/inRule/actions/properties");
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
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "optional",
				validate: mockedFunction,
			},
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
			rule: { body: { properties: { test: { type: "string" } } } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "string" } } } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "string" } } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "userInput",
				validate: mockedFunction,
			},
		];
		expect(properties.validate({
			current: {
				name: "properties",
				value: { myValue: { type: "string", optional: true } },
			},
			rule: { body: { properties: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } }, optional: true } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } }, optional: true } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } }, optional: true },
				},
				{
					name: "properties",
					value: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } },
				},
				{
					name: "test",
					value: { type: "object", properties: { myValue: { type: "string", optional: true } } },
					type: "userInput",
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #3', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "type",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
		];
		expect(properties.validate({
			current: {
				name: "properties",
				value: { type: "string", optional: true },
			},
			rule: { body: { properties: { test: { type: "array", properties: { type: "string", optional: true } } }, optional: true } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "array", properties: { type: "string", optional: true } } }, optional: true } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "array", properties: { type: "string", optional: true } } }, optional: true },
				},
				{
					name: "properties",
					value: { test: { type: "array", properties: { type: "string", optional: true } } },
				},
				{
					name: "test",
					value: { type: "array", properties: { type: "string", optional: true } },
					type: "userInput",
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #4', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return properties.validate({
				current: {
					name: "body",
					value: { properties: { test: { type: "string" } }, type: "foorbar" },
				},
				rule: { body: { properties: { test: { type: "string" } }, type: "foorbar" } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "string" } }, type: "foorbar" } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #5', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
			{
				name: "optional",
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
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #6', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
			{
				name: "optional",
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
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #7', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "userInput",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
		];
		expect(properties.validate({
			current: {
				name: "properties",
				value: { myValue: { type: "string", optional: true } },
			},
			rule: { body: { properties: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } }, optional: true } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } }, optional: true } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } }, optional: true },
				},
				{
					name: "properties",
					value: { test: { type: "object", properties: { myValue: { type: "string", optional: true } } } },
				},
				{
					name: "test",
					value: { type: "object", properties: { myValue: { type: "string", optional: true } } },
					type: "userInput",
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test execute case #1', async () => {
		const mockedFunction = jest.fn(() => {
			return new Promise(resolve => {
				resolve(true);
			});
		});
		const processor = new RuleProcessor();
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
				initalRule: { parameters: { properties: { foor: {}, bar: {} } } },
				parents: [
					{
						name: "none",
						value: { parameters: { properties: { foor: {}, bar: {} } } },
					},
					{
						name: "parameters",
						value: { properties: { foor: {}, bar: {} } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "parameters", value: { foo: "bar", bar: "foo" } },
				initialData: { parameters: { foo: "bar", bar: "foo" }, body: {} },
				parents: [{ name: "none", value: { parameters: { foo: "bar", bar: "foo" }, body: {} } }],
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
		const processor = new RuleProcessor();
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
				initalRule: { parameters: { properties: { foor: {}, bar: {} } } },
				parents: [
					{
						name: "none",
						value: { parameters: { properties: { foor: {}, bar: {} } } },
					},
					{
						name: "parameters",
						value: { properties: { foor: {}, bar: {} } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "body", value: { foo: "bar", bar: "foo" } },
				initialData: { parameters: {}, body: { foo: "bar", bar: "foo" } },
				parents: [{ name: "none", value: { parameters: {}, body: { foo: "bar", bar: "foo" } } }],
			},
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(2);
	});
});


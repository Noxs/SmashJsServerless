const { DEFAULT } = require("../../../../../lib/core/filter/constant");

describe('Default', () => {
	let defaultAction = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		defaultAction = require("../../../../../lib/core/filter/inRule/actions/default");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(defaultAction.name).toBe(DEFAULT);
		expect(defaultAction.execute).toBeFunction();
		expect(defaultAction.validate).toBeFunction();
		expect(defaultAction.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(defaultAction.validate({
			current: {
				name: "default",
				value: "myDefaultString",
			},
			rule: { parameters: { test: { type: "string", default: "myDefaultString" } } },
			parents: [
				{
					name: "parameters",
					value: { test: { type: "string", default: "myDefaultString" } },
				},
				{
					name: "test",
					value: { type: "string", default: "myDefaultString" },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return defaultAction.validate({
				current: {
					name: "default",
					value: 1,
				},
				rule: { parameters: { test: { type: 1 } }, default: "myDefaultString" },
				parents: [
					{
						name: "none",
						value: { parameters: { test: { type: 1 } }, default: "myDefaultString" },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(({ name, value }) => {
			return new Promise((resolve, reject) => {
				resolve("newValue");
			});
		});
		await expect(defaultAction.execute({
			rule: {
				current: {
					name: "default",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { default: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { default: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { default: mockFunction, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: undefined } } }, { name: "body", value: { myVar: undefined } }],
			},
		})).resolves.toBe(true);
		expect(current).toStrictEqual({ name: "myVar", value: "newValue" });
	});

	it('Test execute case #2', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(() => {
			return new Promise((resolve, reject) => {
				reject(new Error());
			});
		});
		await expect(defaultAction.execute({
			rule: {
				current: {
					name: "default",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { default: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { default: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { default: mockFunction, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: undefined } } }, { name: "body", value: { myVar: undefined } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #3', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(() => {
			return "new value";
		});
		await expect(defaultAction.execute({
			rule: {
				current: {
					name: "default",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { default: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { default: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { default: mockFunction, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: undefined } } }, { name: "body", value: { myVar: undefined } }],
			},
		})).resolves.toBe(true);
		expect(current).toStrictEqual({ name: "myVar", value: "new value" });
	});

	it('Test execute case #4', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(() => {
			throw new Error();
		});
		await expect(defaultAction.execute({
			rule: {
				current: {
					name: "default",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { default: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { default: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { default: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { default: mockFunction, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: undefined } } }, { name: "body", value: { myVar: undefined } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #5', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		await expect(defaultAction.execute({
			rule: {
				current: {
					name: "default",
					value: "foobar",
				},
				initalRule: { body: { properties: { myVar: { default: "foobar", type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { default: "foobar", type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { default: "foobar", type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { default: "foobar", type: "string" } },
					},
					{
						name: "myVar",
						value: { default: "foobar", type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: undefined } } }, { name: "body", value: { myVar: undefined } }],
			},
		})).resolves.toBe(true);
		expect(current).toStrictEqual({ name: "myVar", value: "foobar" });
	});
});


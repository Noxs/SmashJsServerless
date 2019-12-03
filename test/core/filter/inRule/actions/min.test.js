const { MIN } = require("../../../../../lib/core/filter/constant");

describe('MinValue', () => {
	let min = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		min = require("../../../../../lib/core/filter/inRule/actions/min");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(min.name).toBe(MIN);
		expect(min.execute).toBeFunction();
		expect(min.validate).toBeFunction();
		expect(min.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(min.validate({
			current: {
				name: "min",
				value: 1,
			},
			rule: { parameters: { test: { type: "integer", min: 1 } } },
			parents: [
				{
					name: "none",
					value: { parameters: { test: { type: "integer", min: 1 } } },
				},
				{
					name: "parameters",
					value: { test: { type: "integer", min: 1 } },
				},
				{
					name: "test",
					value: { type: "integer", min: 1 },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(min.validate({
			current: {
				name: "min",
				value: 1,
			},
			rule: { body: { properties: { test: { type: "integer", match: "^myValueMatch$", min: 1 } } } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "integer", match: "^myValueMatch$", min: 1 } } } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "integer", match: "^myValueMatch$", min: 1 } } },
				},
				{
					name: "properties",
					value: { test: { type: "integer", match: "^myValueMatch$", min: 1 } },
				},
				{
					name: "test",
					value: { type: "integer", match: "^myValueMatch$", min: 1 },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #3', () => {
		expect(() => {
			return min.validate({
				current: {
					name: "min",
					value: true,
				},
				rule: { body: { properties: { test: { type: "string", match: "^myValueMatch$", min: true } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "string", match: "^myValueMatch$", min: true } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "string", match: "^myValueMatch$", min: true } } },
					},
					{
						name: "properties",
						value: { test: { type: "string", match: "^myValueMatch$", min: true } },
					},
					{
						name: "test",
						value: { type: "string", match: "^myValueMatch$", min: true },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #4', () => {
		expect(() => {
			return min.validate({
				current: {
					name: "min",
					value: true,
				},
				rule: { body: { properties: { test: { type: "number", match: "^myValueMatch$", min: true } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "number", match: "^myValueMatch$", min: true } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "number", match: "^myValueMatch$", min: true } } },
					},
					{
						name: "properties",
						value: { test: { type: "number", match: "^myValueMatch$", min: true } },
					},
					{
						name: "test",
						value: { type: "number", match: "^myValueMatch$", min: true },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: 2 },
				initialData: { parameters: {}, body: { myVar: 2 } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: 2 } } }, { name: "body", value: { myVar: 2 } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #2', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: 0 },
				initialData: { parameters: {}, body: { myVar: 0 } },
				parents: [{ name: "none", value: { parameters: { myVar: 0 }, body: {} } }, { body: "parameters", value: { myVar: 0 } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #3', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "array" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "array" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "array" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "array" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "array" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: [1, 2] },
				initialData: { parameters: {}, body: { myVar: [1, 2] } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: [1, 2] } } }, { name: "body", value: { myVar: [1, 2] } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #4', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "array" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "array" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "array" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "array" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "array" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: [] },
				initialData: { parameters: {}, body: { myVar: [] } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: [] } } }, { body: "parameters", value: { myVar: [] } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #5', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "object" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "object" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "object" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "object" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "object" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: { foo: "bar" } },
				initialData: { parameters: {}, body: { myVar: { foo: "bar" } } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: { foo: "bar" } } } }, { name: "body", value: { myVar: { foo: "bar" } } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #6', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "object" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "object" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "object" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "object" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "object" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: {} },
				initialData: { parameters: {}, body: { myVar: {} } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: {} } } }, { name: "body", value: { myVar: {} } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #7', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "object" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "object" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "object" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "object" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: { foo: "bar" } },
				initialData: { parameters: {}, body: { myVar: { foo: "bar" } } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: "" } } }, { name: "body", value: { myVar: "bar" } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #8', async () => {
		await expect(min.execute({
			rule: {
				current: {
					name: "min",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { min: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { min: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { min: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { min: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { min: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "" },
				initialData: { parameters: {}, body: { myVar: "" } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: "" } } }, { name: "body", value: { myVar: "" } }],
			},
		})).rejects.toThrow();
	});
});


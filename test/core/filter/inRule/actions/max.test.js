const { MAX } = require("../../../../../lib/core/filter/constant");

describe('MaxValue', () => {
	let max = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		max = require("../../../../../lib/core/filter/inRule/actions/max");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(max.name).toBe(MAX);
		expect(max.execute).toBeFunction();
		expect(max.validate).toBeFunction();
		expect(max.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(max.validate({
			current: {
				name: "max",
				value: 1,
			},
			rule: { parameters: { test: { type: "integer", max: 1 } } },
			parents: [
				{
					name: "none",
					value: { parameters: { test: { type: "integer", max: 1 } } },
				},
				{
					name: "parameters",
					value: { test: { type: "integer", max: 1 } },
				},
				{
					name: "test",
					value: { type: "integer", max: 1 },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(max.validate({
			current: {
				name: "max",
				value: 1,
			},
			rule: { body: { properties: { test: { type: "integer", match: "^myValueMatch$", max: 1 } } } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "integer", match: "^myValueMatch$", max: 1 } } } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "integer", match: "^myValueMatch$", max: 1 } } },
				},
				{
					name: "properties",
					value: { test: { type: "integer", match: "^myValueMatch$", max: 1 } },
				},
				{
					name: "test",
					value: { type: "integer", match: "^myValueMatch$", max: 1 },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #3', () => {
		expect(() => {
			return max.validate({
				current: {
					name: "max",
					value: true,
				},
				rule: { body: { properties: { test: { type: "string", match: "^myValueMatch$", max: true } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "string", match: "^myValueMatch$", max: true } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "string", match: "^myValueMatch$", max: true } } },
					},
					{
						name: "properties",
						value: { test: { type: "string", match: "^myValueMatch$", max: true } },
					},
					{
						name: "test",
						value: { type: "string", match: "^myValueMatch$", max: true },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #4', () => {
		expect(() => {
			return max.validate({
				current: {
					name: "max",
					value: true,
				},
				rule: { body: { properties: { test: { type: "number", match: "^myValueMatch$", max: true } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "number", match: "^myValueMatch$", max: true } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "number", match: "^myValueMatch$", max: true } } },
					},
					{
						name: "properties",
						value: { test: { type: "number", match: "^myValueMatch$", max: true } },
					},
					{
						name: "test",
						value: { type: "number", match: "^myValueMatch$", max: true },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { max: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: 1 },
				initialData: { parameters: {}, body: { myVar: 1 } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: 1 } } }, { name: "body", value: { myVar: 1 } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #2', async () => {
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { max: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: 2 },
				initialData: { parameters: {}, body: { myVar: 2 } },
				parents: [{ name: "none", value: { parameters: { myVar: 2 }, body: {} } }, { name: "body", value: { myVar: 2 } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #3', async () => {
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 2,
				},
				initalRule: { body: { properties: { myVar: { max: 1, type: "array" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "array" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "array" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "array" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "array" },
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
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { max: 1, type: "array" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "array" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "array" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "array" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "array" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: ["foo", "bar"] },
				initialData: { parameters: {}, body: { myVar: ["foo", "bar"] } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: ["foo", "bar"] } } }, { name: "body", value: { myVar: ["foo", "bar"] } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #5', async () => {
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { max: 1, type: "object" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "object" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "object" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "object" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "object" },
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
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { max: 1, type: "object" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "object" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "object" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "object" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "object" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: { foo: "bar", bar: "foo" } },
				initialData: { parameters: {}, body: { myVar: { foo: "bar", bar: "foo" } } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: { foo: "bar", bar: "foo" } } } }, { name: "body", value: { myVar: { foo: "bar", bar: "foo" } } }],
			},
		})).rejects.toThrow();
	});

	it('Test execute case #7', async () => {
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { max: 2, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "object" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "object" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "object" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "object" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "bar" },
				initialData: { parameters: {}, body: { myVar: "bar" } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: "bar" } } }, { name: "body", value: { myVar: "bar" } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #7', async () => {
		await expect(max.execute({
			rule: {
				current: {
					name: "max",
					value: 1,
				},
				initalRule: { body: { properties: { myVar: { max: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { max: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { max: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { max: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { max: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "fooooobaaaarrrrr" },
				initialData: { parameters: {}, body: { myVar: "fooooobaaaarrrrr" } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: "fooooobaaaarrrrr" } } }, { name: "body", value: { myVar: "fooooobaaaarrrrr" } }],
			},
		})).rejects.toThrow();
	});
});

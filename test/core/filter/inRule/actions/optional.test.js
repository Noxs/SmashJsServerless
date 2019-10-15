const { OPTIONAL } = require("../../../../../lib/core/filter/constant");

describe('Optional', () => {
	let optional = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		optional = require("../../../../../lib/core/filter/inRule/actions/optional");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(optional.name).toBe(OPTIONAL);
		expect(optional.execute).toBeFunction();
		expect(optional.validate).toBeFunction();
		expect(optional.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(optional.validate({
			current: {
				name: "optional",
				value: true,
			},
			rule: { body: { properties: { test: { type: "string", match: "^myValueMatch$", optional: true } } } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "string", match: "^myValueMatch$", optional: true } } } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "string", match: "^myValueMatch$", optional: true } } },
				},
				{
					name: "properties",
					value: { test: { type: "string", match: "^myValueMatch$", optional: true } },
				},
				{
					name: "test",
					value: { type: "string", match: "^myValueMatch$", optional: true },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(optional.validate({
			current: {
				name: "optional",
				value: true,
			},
			rule: { body: { properties: { test: {} }, optional: true } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: {} }, optional: true } },
				},
				{
					name: "body",
					value: { properties: { test: {} }, optional: true },
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #3', () => {
		expect(() => {
			return optional.validate({
				current: {
					name: "optional",
					value: 1,
				},
				rule: { body: { properties: { test: { type: "string", match: "^myValueMatch$", optional: 1 } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "string", match: "^myValueMatch$", optional: 1 } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "string", match: "^myValueMatch$", optional: 1 } } },
					},
					{
						name: "properties",
						value: { test: { type: "string", match: "^myValueMatch$", optional: 1 } },
					},
					{
						name: "test",
						value: { type: "string", match: "^myValueMatch$", optional: 1 },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		await expect(optional.execute({
			rule: {
				current: {
					name: "optional",
					value: true,
				},
				initalRule: { body: { properties: { myVar: { optional: true, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { optional: true, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { optional: true, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { optional: true, type: "string" } },
					},
					{
						name: "myVar",
						value: { optional: true, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: undefined },
				initialData: { parameters: {}, body: {} },
				parents: [{ name: "none", value: { parameters: {}, body: {} } }, { name: "body", value: {} }],
			},
		})).resolves.toBe(false);
	});

	it('Test execute case #2', async () => {
		await expect(optional.execute({
			rule: {
				current: {
					name: "optional",
					value: true,
				},
				initalRule: { body: { properties: { myVar: { optional: true, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { optional: true, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { optional: true, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { optional: true, type: "string" } },
					},
					{
						name: "myVar",
						value: { optional: true, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "123456789" },
				initialData: { parameters: {}, body: { myVar: "123456789" } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: "123456789" } } }, { name: "body", value: { myVar: "123456789" } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #3', async () => {
		await expect(optional.execute({
			rule: {
				current: {
					name: "optional",
					value: false,
				},
				initalRule: { body: { properties: { myVar: { optional: true, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { optional: true, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { optional: true, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { optional: true, type: "string" } },
					},
					{
						name: "myVar",
						value: { optional: true, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: undefined },
				initialData: { parameters: {}, body: {} },
				parents: [{ name: "none", value: { parameters: {}, body: {} } }, { name: "body", value: {} }],
			},
		})).rejects.toThrow();
	});
});


const { CAST_TO } = require("../../../../../lib/core/filter/constant");

describe('CastTo', () => {
	let castTo = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		castTo = require("../../../../../lib/core/filter/inRule/actions/castTo");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(castTo.name).toBe(CAST_TO);
		expect(castTo.execute).toBeFunction();
		expect(castTo.validate).toBeFunction();
		expect(castTo.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(castTo.validate({
			current: {
				name: "castTo",
				value: "string",
			},
			rule: { properties: { test: { castTo: "string" } } },
			parents: [
				{
					name: "properties",
					value: { test: { castTo: "string" } },
				},
				{
					name: "test",
					value: { castTo: "string" },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return castTo.validate({
				current: {
					name: "castTo",
					value: 1,
				},
				rule: { parameters: { test: { castTo: 1 } } },
				parents: [
					{
						name: "parameters",
						value: { test: { castTo: 1 } },
					},
					{
						name: "test",
						value: { castTo: 1 },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => {
			return castTo.validate({
				current: {
					name: "castTo",
					value: "foobar",
				},
				rule: { parameters: { test: { castTo: 1 } } },
				parents: [
					{
						name: "parameters",
						value: { test: { castTo: "foobar" } },
					},
					{
						name: "test",
						value: { castTo: "foobar" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const initialData = { parameters: {}, body: { myVar: 1 } };
		const current = { name: "myVar", value: 1 };
		await expect(castTo.execute({
			rule: {
				current: {
					name: "castTo",
					value: "string",
				},
				initalRule: { body: { properties: { myVar: { castTo: "string", type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { castTo: "string", type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { castTo: "string", type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { castTo: "string", type: "string" } },
					},
					{
						name: "myVar",
						value: { castTo: "string", type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [
					{ name: "none", value: { parameters: {}, body: { myVar: 1 } } },
					{ name: "body", value: { myVar: 1 } },
				],
			},
		})).resolves.toBe(true);
		expect(current).toStrictEqual({ name: "myVar", value: "1" });
	});

	it('Test execute case #2', async () => {
		const initialData = { parameters: {}, body: { myVar: 1 } };
		const current = { name: "myVar", value: 1 };
		await expect(castTo.execute({
			rule: {
				current: {
					name: "castTo",
					value: "boolean",
				},
				initalRule: { body: { properties: { myVar: { castTo: "string", type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { castTo: "string", type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { castTo: "string", type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { castTo: "string", type: "string" } },
					},
					{
						name: "myVar",
						value: { castTo: "string", type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: 1 } } }, { name: "body", value: { myVar: 1 } }],
			},
		})).resolves.toBe(true);
		expect(current).toStrictEqual({ name: "myVar", value: true });
	});

	it('Test execute case #3', async () => {
		const initialData = { parameters: {}, body: { myVar: "123456" } };
		const current = { name: "myVar", value: "123456" };
		await expect(castTo.execute({
			rule: {
				current: {
					name: "castTo",
					value: "number",
				},
				initalRule: { body: { properties: { myVar: { castTo: "string", type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { castTo: "string", type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { castTo: "string", type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { castTo: "string", type: "string" } },
					},
					{
						name: "myVar",
						value: { castTo: "string", type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: "123456" } } }, { name: "body", value: { myVar: "123456" } }],
			},
		})).resolves.toBe(true);
		expect(current).toStrictEqual({ name: "myVar", value: 123456 });
	});
});


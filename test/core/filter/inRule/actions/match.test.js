const { MATCH } = require("../../../../../lib/core/filter/constant");

describe('Match', () => {
	let match = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		match = require("../../../../../lib/core/filter/inRule/actions/match");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(match.name).toBe(MATCH);
		expect(match.execute).toBeFunction();
		expect(match.validate).toBeFunction();
		expect(match.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(match.validate({
			current: {
				name: "match",
				value: "^test$",
			},
			rule: { parameters: { test: { type: "string", match: "^myValueMatch$" } } },
			parents: [
				{
					name: "parameters",
					value: { test: { type: "string", match: "^myValueMatch$" } },
				},
				{
					name: "test",
					value: { type: "string", match: "^myValueMatch$" },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return match.validate({
				current: {
					name: "match",
					value: 1,
				},
				rule: { parameters: { test: { type: "string", match: "^myValueMatch$" } } },
				parents: [
					{
						name: "parameters",
						value: { test: { type: "string", match: "^myValueMatch$" } },
					},
					{
						name: "test",
						value: { type: "string", match: "^myValueMatch$" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => {
			return match.validate({
				current: {
					name: "match",
					value: "ok",
				},
				rule: { parameters: { test: { type: "number", match: "^myValueMatch$" } } },
				parents: [
					{
						name: "parameters",
						value: { test: { type: "number", match: "^myValueMatch$" } },
					},
					{
						name: "test",
						value: { type: "number", match: "^myValueMatch$" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => {
			return match.validate({
				current: {
					name: "match",
					value: "^+*$",
				},
				rule: { parameters: { test: { type: "number", match: "^myValueMatch$" } } },
				parents: [
					{
						name: "parameters",
						value: { test: { type: "number", match: "^myValueMatch$" } },
					},
					{
						name: "test",
						value: { type: "number", match: "^myValueMatch$" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		await expect(match.execute({
			rule: {
				current: {
					name: "match",
					value: "^yolo$",
				},
				initalRule: { body: { properties: { myVar: { match: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { match: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { match: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { match: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { match: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "yolo" },
				initialData: { parameters: {}, body: { myVar: "yolo" } },
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: "yolo" } } }, { name: "body", value: { myVar: "yolo" } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #2', async () => {
		await expect(match.execute({
			rule: {
				current: {
					name: "match",
					value: "^yolo$",
				},
				initalRule: { body: { properties: { myVar: { match: 1, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { match: 1, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { match: 1, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { match: 1, type: "string" } },
					},
					{
						name: "myVar",
						value: { match: 1, type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "foobar" },
				initialData: { parameters: {}, body: { myVar: "foobar" } },
				parents: [{ name: "none", value: { parameters: { myVar: "foobar" }, body: {} } }, { body: "parameters", value: { myVar: "foobar" } }],
			},
		})).rejects.toThrow();
	});
});


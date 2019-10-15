const { CLEAN } = require("../../../../../lib/core/filter/constant");

describe('Clean', () => {
	let clean = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		clean = require("../../../../../lib/core/filter/inRule/actions/clean");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(clean.name).toBe(CLEAN);
		expect(clean.execute).toBeFunction();
		expect(clean.validate).toBeFunction();
		expect(clean.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(clean.validate({
			current: {
				name: "clean",
				value: true,
			},
			rule: { body: { properties: { test: { type: "object", clean: true } } } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "object", clean: true } } } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "object", clean: true } } },
				},
				{
					name: "properties",
					value: { test: { type: "object", clean: true } },
				},
				{
					name: "test",
					value: { type: "object", clean: true },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(clean.validate({
			current: {
				name: "clean",
				value: true,
			},
			rule: { body: { properties: { test: {} }, clean: true } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: {} }, clean: true } },
				},
				{
					name: "body",
					value: { properties: { test: {} }, clean: true },
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #3', () => {
		expect(() => {
			return clean.validate({
				current: {
					name: "clean",
					value: 1,
				},
				rule: { body: { properties: { test: { type: "string", match: "^myValueMatch$", clean: 1 } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "string", match: "^myValueMatch$", clean: 1 } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "string", match: "^myValueMatch$", clean: 1 } } },
					},
					{
						name: "properties",
						value: { test: { type: "string", match: "^myValueMatch$", clean: 1 } },
					},
					{
						name: "test",
						value: { type: "string", match: "^myValueMatch$", clean: 1 },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #4', () => {
		expect(() => {
			return clean.validate({
				current: {
					name: "clean",
					value: true,
				},
				rule: { body: { properties: { test: { type: "string", match: "^myValueMatch$", clean: true } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "string", match: "^myValueMatch$", clean: true } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "string", match: "^myValueMatch$", clean: true } } },
					},
					{
						name: "properties",
						value: { test: { type: "string", match: "^myValueMatch$", clean: true } },
					},
					{
						name: "test",
						value: { type: "string", match: "^myValueMatch$", clean: true },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const initialData = { parameters: {}, body: { foo: "bar", bar: "foo", toClean: "yes", toRemove: "yes" } };
		const current = { name: "body", value: { foo: "bar", bar: "foo", toClean: "yes", toRemove: "yes" } };
		await expect(clean.execute({
			rule: {
				current: {
					name: "clean",
					value: true,
				},
				initalRule: { body: { properties: { myVar: { type: "string" } }, clean: true } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { type: "string" } }, clean: true } },
					},
					{
						name: "body",
						value: { properties: { foo: { type: "string" }, bar: { type: "string" } }, clean: true },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [
					{ name: "none", value: { parameters: {}, body: { foo: "bar", bar: "foo", toClean: "yes", toRemove: "yes" } } },
				],
			},
		})).resolves.toBe(true);
		expect(current).toStrictEqual({ name: "body", value: { foo: "bar", bar: "foo" } });
	});
});


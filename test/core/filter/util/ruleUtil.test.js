describe('RuleUtil', () => {
	let ruleUtil = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../smash');
		ruleUtil = require("../../../../lib/core/filter/util/ruleUtil");
	});

	beforeEach(() => {

	});

	it('Test readable', () => {
		expect(ruleUtil.readable({ version: "01-2019", action: "myFooBarAction", type: "inRule" })).toBe("action: myFooBarAction, type: inRule, version: 01-2019");
	});

	it('Test isObject', () => {
		expect(ruleUtil.isObject({ value: {} })).toBe(true);
		expect(ruleUtil.isObject({ value: [] })).toBe(true);
		expect(ruleUtil.isObject({ value: "" })).toBe(false);
		expect(ruleUtil.isObject({ value: false })).toBe(false);
		expect(ruleUtil.isObject({ value: () => { } })).toBe(false);
		expect(ruleUtil.isObject({ value: 1 })).toBe(false);
	});

	it('Test isArray', () => {
		expect(ruleUtil.isArray({ value: {} })).toBe(false);
		expect(ruleUtil.isArray({ value: [] })).toBe(true);
		expect(ruleUtil.isArray({ value: "" })).toBe(false);
		expect(ruleUtil.isArray({ value: false })).toBe(false);
		expect(ruleUtil.isArray({ value: () => { } })).toBe(false);
		expect(ruleUtil.isArray({ value: 1 })).toBe(false);
	});

	it('Test isBoolean', () => {
		expect(ruleUtil.isBoolean({ value: {} })).toBe(false);
		expect(ruleUtil.isBoolean({ value: [] })).toBe(false);
		expect(ruleUtil.isBoolean({ value: "" })).toBe(false);
		expect(ruleUtil.isBoolean({ value: false })).toBe(true);
		expect(ruleUtil.isBoolean({ value: () => { } })).toBe(false);
		expect(ruleUtil.isBoolean({ value: 1 })).toBe(false);
	});

	it('Test isFunction', () => {
		expect(ruleUtil.isFunction({ value: {} })).toBe(false);
		expect(ruleUtil.isFunction({ value: [] })).toBe(false);
		expect(ruleUtil.isFunction({ value: "" })).toBe(false);
		expect(ruleUtil.isFunction({ value: false })).toBe(false);
		expect(ruleUtil.isFunction({ value: () => { } })).toBe(true);
		expect(ruleUtil.isFunction({ value: 1 })).toBe(false);
	});

	it('Test isNumber', () => {
		expect(ruleUtil.isNumber({ value: {} })).toBe(false);
		expect(ruleUtil.isNumber({ value: [] })).toBe(false);
		expect(ruleUtil.isNumber({ value: "" })).toBe(false);
		expect(ruleUtil.isNumber({ value: false })).toBe(false);
		expect(ruleUtil.isNumber({ value: () => { } })).toBe(false);
		expect(ruleUtil.isNumber({ value: 1 })).toBe(true);
	});

	it('Test isString', () => {
		expect(ruleUtil.isString({ value: {} })).toBe(false);
		expect(ruleUtil.isString({ value: [] })).toBe(false);
		expect(ruleUtil.isString({ value: "" })).toBe(true);
		expect(ruleUtil.isString({ value: false })).toBe(false);
		expect(ruleUtil.isString({ value: () => { } })).toBe(false);
		expect(ruleUtil.isString({ value: 1 })).toBe(false);
	});

	it('Test typeError', () => {
		expect(ruleUtil.typeError({ current: { name: { value: "" }, value: { value: {} } }, ruleConfig: { value: {} }, expected: { value: "" } })).toBeObject();
		expect(() => ruleUtil.typeError({ current: { name: { value: "" }, value: { value: {} } }, ruleConfig: { value: {} }, expected: { value: "" } })).not.toThrow();
	});

	it('Test valueError', () => {
		expect(ruleUtil.valueError({ current: { name: { value: "" }, value: { value: {} } }, ruleConfig: { value: {} }, expected: "" })).toBeObject();
		expect(() => ruleUtil.valueError({ current: { name: { value: "" }, value: { value: {} } }, ruleConfig: { value: {} }, expected: "" })).not.toThrow();
	});

	it('Test isSameType', () => {
		expect(ruleUtil.isSameType({ value: "test" }, "string")).toBe(true);
		expect(ruleUtil.isSameType({ value: {} }, "string")).toBe(false);
	});

	it('Test fullName', () => {
		expect(ruleUtil.fullName([{ name: "none" }], { name: "parameters" })).toBe("parameters");
		expect(ruleUtil.fullName([{ name: "none" }, { name: "body" }], { name: "parameters" })).toBe("body.parameters");
		expect(ruleUtil.fullName([{ name: "none" }, { name: "body" }, { name: "properties" }, { name: "toto" }], { name: "type" })).toBe("body.properties.toto.type");
	});

	it('Test getLatestFromNames case #1', () => {
		const config = {
			test: "ok",
		};
		const parents = [
			{ name: "test", value: "ok" },
		];
		expect(ruleUtil.getLatestFromNames(config, parents, 1)).toStrictEqual("ok");
	});

	it('Test getLatestFromNames case #2', () => {
		const config = {
			first: {
				second: "ok",
			},
		};
		const parents = [
			{ name: "first", value: { second: "ok" } },
			{ name: "second", value: "ok" },
		];
		expect(ruleUtil.getLatestFromNames(config, parents, 2)).toStrictEqual("ok");
	});

	it('Test getLatestFromNames case #3', () => {
		const config = {
			properties: {
				userInput: {
					siblings: [
						{ name: "type" },
						{ name: "min" },
						{ name: "max" },
						{ name: "validate" },
					],
					children: {
						types: ["string"],
					},
				},
			},
		};
		const parents = [
			{ name: 'none', value: { parameters: { properties: { id: { castTo: 'string' } } } }, body: {} },
			{ name: 'parameters', value: { properties: { id: { castTo: 'string' } } } },
			{ name: 'properties', value: { id: { castTo: 'string' } } },
			{ name: 'id', value: { castTo: 'string' }, type: 'userInput' },
		];
		expect(ruleUtil.getLatestFromNames(config, parents, 2)).toStrictEqual({
			siblings: [
				{ name: "type" },
				{ name: "min" },
				{ name: "max" },
				{ name: "validate" },
			],
			children: {
				types: ["string"],
			},
		});
	});

	it('Test getLatestFromNames case #4', () => {
		const config = {
			parameters: {
				userInput: {
					siblings: [
						{ name: "type" },
						{ name: "min" },
						{ name: "max" },
						{ name: "validate" },
					],
					children: {
						types: ["string"],
					},
				},
			},
		};
		const parents = [
			{ name: 'none', value: { parameters: { properties: { id: { castTo: 'string' } } } }, body: {} },
			{ name: 'parameters', value: { properties: { id: { castTo: 'string' } } } },
			{ name: 'properties', value: { id: { castTo: 'string' } } },
			{ name: 'id', value: { castTo: 'string' }, type: 'userInput' },
		];
		expect(() => ruleUtil.getLatestFromNames(config, parents, 2, "foobar")).toThrow();
	});

	it('Test loadCurrentValue case #1', () => {
		const current = { name: "myObject", value: undefined };
		const parents = [
			{
				name: "none",
				value: {
					parameters: { id: "1234256789" },
					body: {
						myObject: { item: "troll" },
						omg: true,
					},
				},
			},
			{
				name: "body",
				value: {
					myObject: { item: "troll" },
					omg: true,
				},
			},
		];
		const initialData = {
			parameters: { id: "1234256789" },
			body: {
				myObject: { item: "troll" },
				omg: true,
			},
		};
		ruleUtil.loadCurrentValue({ current, parents, initialData });
		expect(current).toStrictEqual({ name: "myObject", value: { item: "troll" } });
	});

	it('Test loadCurrentValue case #2', () => {
		const current = { name: 'body', value: { foo: 'bar', bar: 'foo', toClean: 'yes', toRemove: 'yes' } };
		const parents = [
			{
				name: "none",
				value: {
					parameters: {},
					body: { foo: 'bar', bar: 'foo', toClean: 'yes', toRemove: 'yes' },
				},
			},
		];
		const initialData = {
			parameters: {},
			body: { foo: 'bar', bar: 'foo', toClean: 'yes', toRemove: 'yes' },
		};
		ruleUtil.loadCurrentValue({ current, parents, initialData });
		expect(current).toStrictEqual({ name: "body", value: { foo: 'bar', bar: 'foo', toClean: 'yes', toRemove: 'yes' } });
	});

	it('Test saveCurrentValue case #1', () => {
		const current = { name: "myObject", value: { item: "troll" } };
		const parents = [
			{
				name: "none",
				value: {
					parameters: { id: "1234256789" },
					body: {
						myObject: {},
						omg: true,
					},
				},
			},
			{
				name: "body",
				value: {
					myObject: {},
					omg: true,
				},
			},
		];
		const initialData = {
			parameters: { id: "1234256789" },
			body: {
				myObject: {},
				omg: true,
			},
		};
		ruleUtil.saveCurrentValue({ current, parents, initialData });
		expect(initialData).toStrictEqual({
			parameters: { id: "1234256789" },
			body: {
				myObject: { item: "troll" },
				omg: true,
			},
		});
	});

	it('Test removeCurrentValue case #1', () => {
		const current = { name: "item", value: { foo: "bar" } };
		const parents = [
			{
				name: "none",
				value: {
					item: { foo: "bar" },
				},
			},
		];
		const initialData = {
			item: { foo: "bar" },
		};
		ruleUtil.removeCurrentValue({ current, parents, initialData });
		expect(initialData).toStrictEqual({});
	});

	it('Test removeCurrentValue case #2', () => {
		const current = { name: "foo", value: "bar" };
		const parents = [
			{
				name: "none",
				value: {
					item: { foo: "bar" },
				},
			},
			{
				name: "item",
				value: { foo: "bar" },
			},
		];
		const initialData = {
			item: { foo: "bar" },
		};
		ruleUtil.removeCurrentValue({ current, parents, initialData });
		expect(initialData).toStrictEqual({
			item: {},
		});
	});

	it('Test match case #1', () => {
		const finded = { name: "type", match: "^(string)$" };
		const itemToTest = { name: "type", value: "string" };
		const ruleConfig = { version: "01-2019", type: "inRule", action: "myFooBarAction" };
		expect(ruleUtil.match(finded, itemToTest, ruleConfig)).toBe(true);
	});

	it('Test match case #2', () => {
		const finded = { name: "type", match: "^(string)$" };
		const itemToTest = { name: "type", value: "boolean" };
		const ruleConfig = { version: "01-2019", type: "inRule", action: "myFooBarAction" };
		expect(() => ruleUtil.match(finded, itemToTest, ruleConfig)).toThrow();
	});

	it('Test getSibling', () => {
		const parents = [
			{ name: "first", value: { second: "ok" } },
		];
		expect(ruleUtil.getSibling(parents, "second")).toStrictEqual("ok");
	});

	it('Test validateSiblings case #1', () => {
		expect(() => ruleUtil.validateSiblings({
			siblings: [
				{ name: "type" },
			],
			current: {
				name: "min",
				value: { value: 1 },
			},
			parents: [
				{ name: "test", value: { min: { value: 1 }, castTo: "number" } },
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toThrow();
	});

	it('Test validateSiblings case #2', () => {
		expect(ruleUtil.validateSiblings({
			siblings: [
				{ name: "castTo" },
				{ name: "type" },
			],
			current: {
				name: "min",
				value: { value: 1 },
			},
			parents: [
				{
					name: "test",
					value: { min: { value: 1 }, castTo: "number" },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toBe(true);
	});

	it('Test validateSiblings case #3', () => {
		expect(ruleUtil.validateSiblings({
			siblings: [
				{ name: "type", match: "^(string|number|unsigned integer|array|object)$" },
			],
			current: {
				name: "min",
				value: { value: 1 },
			},
			parents: [
				{
					name: "test",
					value: { min: { value: 1 }, type: "number" },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toBe(true);
	});

	it('Test validateSiblings case #4', () => {
		expect(() => ruleUtil.validateSiblings({
			siblings: [
				{ name: "type", match: "^(string|number|unsigned integer|array|object)$" },
			],
			current: {
				name: "min",
				value: { value: 1 },
			},
			parents: [
				{
					name: "test",
					value: { min: { value: 1 }, type: "boolean" },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toThrow();
	});

	it('Test validateSiblings case #5', () => {
		expect(() => ruleUtil.validateSiblings({
			siblings: [
				{ name: "clean" },
			],
			current: {
				name: "proeprties",
				value: { value: 1 },
			},
			parents: [
				{
					name: "test",
					value: { prooperties: { value: 1 }, name: "clean" },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toThrow();
	});

	it('Test validateChild case #1', () => {
		expect(ruleUtil.validateChild({
			children: { types: ["number"] },
			child: {
				name: "min",
				value: 1,
			},
			current: {
				name: "userInput",
				value: { min: 1, castTo: "number" },
			},
			parents: [
				{
					name: "parameters",
					value: { userInput: { min: 1, castTo: "number" } },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toBe(true);
	});

	it('Test validateChild case #2', () => {
		expect(() => {
			return ruleUtil.validateChild({
				children: { types: ["number"] },
				child: {
					name: "min",
					value: "my invalid number",
				},
				current: {
					name: "userInput",
					value: { min: "my test string", castTo: "number" },
				},
				parents: [
					{
						name: "parameters",
						value: { userInput: { min: "my test string", castTo: "number" } },
					},
				],
				ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
			});
		}).toThrow();
	});

	it('Test validateChild case #3', () => {
		expect(ruleUtil.validateChild({
			children: [
				{ name: "type" },
				{ name: "min" },
			],
			child: {
				name: "type",
				value: "string",
			},
			current: {
				name: "userInput",
				value: { type: "string", min: 1 },
			},
			parents: [
				{
					name: "parameters",
					value: { userInput: { type: "string", min: 1 } },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toBe(true);
	});

	it('Test validateChild case #4', () => {
		expect(() => {
			return ruleUtil.validateChild({
				children: [
					{ name: "min" },
				],
				child: {
					name: "type",
					value: "string",
				},
				current: {
					name: "userInput",
					value: { type: "string", min: 1 },
				},
				parents: [
					{
						name: "parameters",
						value: { userInput: { type: "string", min: 1 } },
					},
				],
				ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
			});
		}).toThrow();
	});

	it('Test validateChild case #5', () => {
		expect(() => {
			return ruleUtil.validateChild({
				children: [
					{ name: "min" },
				],
				child: {
					name: "type",
					value: "foobar",
				},
				current: {
					name: "userInput",
					value: { type: "string", min: 1 },
				},
				parents: [
					{
						name: "parameters",
						value: { userInput: { type: "string", min: 1 } },
					},
				],
				ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
			});
		}).toThrow();
	});

	it('Test validateChild case #6', () => {
		expect(ruleUtil.validateChild({
			children: [
				{ name: "min" },
				{ name: "type" },
			],
			child: {
				name: "type",
				value: "string",
			},
			current: {
				name: "myValue",
				value: { type: "string", min: 1 },
			},
			parents: [
				{
					name: "parameters",
					value: { myValue: { type: "string", min: 1 } },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toBe(true);
	});

	it('Test validateChild case #7', () => {
		expect(ruleUtil.validateChild({
			children: [
				{ name: "userInput" },
			],
			child: {
				name: "foobar",
				value: { type: "string" },
				type: 'userInput',
			},
			current: {
				name: "properties",
				value: { foobar: { type: "string" } },
			},
			parents: [
				{
					name: "none",
					value: { body: { properties: { foobar: { type: "string" } } } },
				},
				{
					name: "body",
					value: { properties: { foobar: { type: "string" } } },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toBe(true);
	});

	it('Test validateChild case #8', () => {
		expect(ruleUtil.validateChild({
			children: [
				{ name: "type", match: "^(string)$" },
			],
			child: {
				name: "type",
				value: "string",
			},
			current: {
				name: "foobar",
				value: { type: "string" },
			},
			parents: [
				{
					name: "none",
					value: { body: { properties: { foobar: { type: "string" } } } },
				},
				{
					name: "body",
					value: { properties: { foobar: { type: "string" } } },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toBe(true);
	});

	it('Test validateChild case #9', () => {
		expect(() => ruleUtil.validateChild({
			children: [
				{ name: "type", match: "^(string)$" },
			],
			child: {
				name: "type",
				value: "boolean",
			},
			current: {
				name: "foobar",
				value: { type: "boolean" },
			},
			parents: [
				{
					name: "none",
					value: { body: { properties: { foobar: { type: "boolean" } } } },
				},
				{
					name: "body",
					value: { properties: { foobar: { type: "boolean" } } },
				},
			],
			ruleConfig: { version: "01-2019", type: "inRule", action: "myFooBarAction" },
		})).toThrow();
	});
});


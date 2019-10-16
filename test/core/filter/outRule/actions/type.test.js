const { TYPE } = require("../../../../../lib/core/filter/constant");

describe('Type', () => {
	let type = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		type = require("../../../../../lib/core/filter/outRule/actions/type");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(type.name).toBe(TYPE);
		expect(type.execute).toBeFunction();
		expect(type.validate).toBeFunction();
		expect(type.config).toBeObject();
	});

	it('Test validate case #1', () => {
		expect(type.validate({
			current: {
				name: "type",
				value: "string",
			},
			rule: { properties: { test: { type: "string" } } },
			parents: [
				{
					name: "none",
					value: { properties: { test: { type: "string" } } },
				},
				{
					name: "properties",
					value: { test: { type: "string" } },
				},
				{
					name: "test",
					value: { type: "string" },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return type.validate({
				current: {
					name: "type",
					value: 1,
				},
				rule: { properties: { test: { type: 1 } } },
				parents: [
					{
						name: "none",
						value: { properties: { test: { type: 1 } } },
					},
					{
						name: "properties",
						value: { test: { type: 1 } },
					},
					{
						name: "test",
						value: { type: 1 },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => {
			return type.validate({
				current: {
					name: "type",
					value: "foobar",
				},
				rule: { properties: { test: { type: 1 } } },
				parents: [
					{
						name: "none",
						value: { properties: { test: { type: 1 } } },
					},
					{
						name: "properties",
						value: { test: { type: 1 } },
					},
					{
						name: "test",
						value: { type: "foobar" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const data = {
			current: { name: "myVar", value: "123456789" },
			initialData: { myVar: "123456789" },
			parents: [{ name: "none", value: { myVar: "123456789" } }],
		};
		await expect(type.execute({
			rule: {
				current: {
					name: "type",
					value: "string",
				},
				initalRule: { properties: { myVar: { type: "string" } } },
				parents: [
					{
						name: "none",
						value: { properties: { myVar: { type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { type: "string" } },
					},
					{
						name: "myVar",
						value: { type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			},
			data,
		})).resolves.toBe(true);
	});

	it('Test execute case #2', async () => {
		const data = {
			current: { name: "myVar", value: 123456789 },
			initialData: { myVar: 123456789 },
			parents: [{ name: "none", value: { myVar: 123456789 } }],
		};
		await expect(type.execute({
			rule: {
				current: {
					name: "type",
					value: "string",
				},
				initalRule: { properties: { myVar: { type: "string" } } },
				parents: [
					{
						name: "none",
						value: { properties: { myVar: { type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { type: "string" } },
					},
					{
						name: "myVar",
						value: { type: "string" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			},
			data,
		})).resolves.toBe(false);
		expect(data.initialData).toStrictEqual({});
	});

	it('Test type number', () => {
		expect(type.TYPES.number(1)).toBe(true);
		expect(type.TYPES.number("1")).toBe(false);
		expect(type.TYPES.number("abc")).toBe(false);
	});

	it('Test type integer', () => {
		expect(type.TYPES.integer(1)).toBe(true);
		expect(type.TYPES.integer("1")).toBe(false);
		expect(type.TYPES.integer("abc")).toBe(false);
		expect(type.TYPES.integer(1.1)).toBe(false);
	});

	it('Test type int', () => {
		expect(type.TYPES.int(1)).toBe(true);
		expect(type.TYPES.int("1")).toBe(false);
		expect(type.TYPES.int("abc")).toBe(false);
		expect(type.TYPES.int(1.1)).toBe(false);
	});

	it('Test type string', () => {
		expect(type.TYPES.string("1")).toBe(true);
		expect(type.TYPES.string("abc")).toBe(true);
		expect(type.TYPES.string(1)).toBe(false);
		expect(type.TYPES.string(1.1)).toBe(false);
	});

	it('Test type unsigned integer', () => {
		expect(type.TYPES["unsigned integer"](1)).toBe(true);
		expect(type.TYPES["unsigned integer"]("abc")).toBe(false);
		expect(type.TYPES["unsigned integer"]("1")).toBe(false);
		expect(type.TYPES["unsigned integer"](1.1)).toBe(false);
	});

	it('Test type uint', () => {
		expect(type.TYPES.uint(1)).toBe(true);
		expect(type.TYPES.uint("abc")).toBe(false);
		expect(type.TYPES.uint("1")).toBe(false);
		expect(type.TYPES.uint(1.1)).toBe(false);
	});

	it('Test type boolean', () => {
		expect(type.TYPES.boolean(true)).toBe(true);
		expect(type.TYPES.boolean("abc")).toBe(false);
		expect(type.TYPES.boolean("1")).toBe(false);
		expect(type.TYPES.boolean(1.1)).toBe(false);
		expect(type.TYPES.boolean("true")).toBe(false);
	});

	it('Test type array', () => {
		expect(type.TYPES.array([])).toBe(true);
		expect(type.TYPES.array({})).toBe(false);
		expect(type.TYPES.array("abc")).toBe(false);
		expect(type.TYPES.array("1")).toBe(false);
		expect(type.TYPES.array(1.1)).toBe(false);
		expect(type.TYPES.array("true")).toBe(false);
	});

	it('Test type object', () => {
		expect(type.TYPES.object([])).toBe(false);
		expect(type.TYPES.object({})).toBe(true);
		expect(type.TYPES.object(true)).toBe(false);
		expect(type.TYPES.object("abc")).toBe(false);
		expect(type.TYPES.object("1")).toBe(false);
		expect(type.TYPES.object(1.1)).toBe(false);
		expect(type.TYPES.object("true")).toBe(false);
	});
});


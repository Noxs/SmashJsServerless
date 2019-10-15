const { TYPE } = require("../../../../../lib/core/filter/constant");

describe('Type', () => {
	let type = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		type = require("../../../../../lib/core/filter/inRule/actions/type");
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
			rule: { parameters: { properties: { test: { type: "string" } } } },
			parents: [
				{
					name: "none",
					value: { parameters: { properties: { test: { type: "string" } } } },
				},
				{
					name: "parameters",
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
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return type.validate({
				current: {
					name: "type",
					value: 1,
				},
				rule: { parameters: { properties: { test: { type: 1 } } } },
				parents: [
					{
						name: "none",
						value: { parameters: { properties: { test: { type: 1 } } } },
					},
					{
						name: "parameters",
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
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
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
				rule: { parameters: { properties: { test: { type: 1 } } } },
				parents: [
					{
						name: "none",
						value: { parameters: { properties: { test: { type: 1 } } } },
					},
					{
						name: "parameters",
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
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		await expect(type.execute({
			rule: {
				current: {
					name: "type",
					value: "string",
				},
				initalRule: { parameters: { properties: { myVar: { castTo: "string", type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { parameters: { properties: { myVar: { castTo: "string", type: "string" } } } },
					},
					{
						name: "parameters",
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
				current: { name: "myVar", value: "123456789" },
				initialData: { parameters: { myVar: "123456789" }, body: {} },
				parents: [{ name: "none", value: { parameters: { myVar: "123456789" }, body: {} } }, { name: "parameters", value: { myVar: "123456789" } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #2', async () => {
		await expect(type.execute({
			rule: {
				current: {
					name: "type",
					value: "string",
				},
				initalRule: { parameters: { properties: { myVar: { castTo: "string", type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { parameters: { properties: { myVar: { castTo: "string", type: "string" } } } },
					},
					{
						name: "parameters",
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
				current: { name: "myVar", value: 123456789 },
				initialData: { parameters: { myVar: 123456789 }, body: {} },
				parents: [{ name: "none", value: { parameters: { myVar: 123456789 }, body: {} } }, { name: "parameters", value: { myVar: 123456789 } }],
			},
		})).rejects.toThrow();
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

	it('Test type object', () => {
		expect(type.typeOfValue([])).toBe("array");
		expect(type.typeOfValue({})).toBe("object");
		expect(type.typeOfValue(true)).toBe("boolean");
		expect(type.typeOfValue("abc")).toBe("string");
		expect(type.typeOfValue("1")).toBe("string");
		expect(type.typeOfValue(1.1)).toBe("number");
		expect(type.typeOfValue(1)).toBe("unsigned integer");
		expect(type.typeOfValue(-1)).toBe("integer");
		expect(type.typeOfValue("true")).toBe("string");
	});
});


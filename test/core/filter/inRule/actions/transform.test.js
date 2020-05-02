const { TRANSFORM } = require("../../../../../lib/core/filter/constant");

describe('Transform', () => {
	let transform = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		transform = require("../../../../../lib/core/filter/inRule/actions/transform");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(transform.name).toBe(TRANSFORM);
		expect(transform.execute).toBeFunction();
		expect(transform.validate).toBeFunction();
		expect(transform.config).toBeObject();
	});

	it('Test validate case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		expect(transform.validate({
			current: {
				name: "transform",
				value: mockedFunction,
			},
			rule: { body: { properties: { test: { transform: mockedFunction } } } },
			parents: [
				{
					name: "body",
					value: { properties: { test: { transform: mockedFunction } } },
				},
				{
					name: "properties",
					value: { test: { transform: mockedFunction } },
				},
				{
					name: "test",
					value: { transform: mockedFunction },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return transform.validate({
				current: {
					name: "transform",
					value: 1,
				},
				rule: { body: { properties: { test: { transform: 1 } } } },
				parents: [
					{
						name: "body",
						value: { properties: { test: { transform: 1 } } },
					},
					{
						name: "properties",
						value: { test: { transform: 1 } },
					},
					{
						name: "test",
						value: { transform: 1 },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => {
			return transform.validate({
				current: {
					name: "transform",
					value: "foobar",
				},
				rule: { body: { properties: { test: { transform: "foobar" } } } },
				parents: [
					{
						name: "body",
						value: { properties: { test: { transform: "foobar" } } },
					},
					{
						name: "properties",
						value: { test: { transform: "foobar" } },
					},
					{
						name: "test",
						value: { transform: "foobar" },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(() => {
			return new Promise((resolve, reject) => {
				resolve("newValue");
			});
		});
		await expect(transform.execute({
			rule: {
				current: {
					name: "transform",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { transform: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { transform: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { transform: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { transform: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { transform: mockFunction, type: "string" },
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
	});

	it('Test execute case #2', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(() => {
			return new Promise((resolve, reject) => {
				reject(new Error());
			});
		});
		await expect(transform.execute({
			rule: {
				current: {
					name: "transform",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { transform: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { transform: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { transform: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { transform: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { transform: mockFunction, type: "string" },
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
});


const { VALIDATE } = require("../../../../../lib/core/filter/constant");

describe('Validate', () => {
	let validate = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		validate = require("../../../../../lib/core/filter/inRule/actions/validate");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(validate.name).toBe(VALIDATE);
		expect(validate.execute).toBeFunction();
		expect(validate.validate).toBeFunction();
		expect(validate.config).toBeObject();
	});

	it('Test validate case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		expect(validate.validate({
			current: {
				name: "validate",
				value: mockedFunction,
			},
			rule: { parameters: { test: { validate: mockedFunction } } },
			parents: [
				{
					name: "parameters",
					value: { test: { validate: mockedFunction } },
				},
				{
					name: "test",
					value: { validate: mockedFunction },
					type: "userInput",
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return validate.validate({
				current: {
					name: "validate",
					value: 1,
				},
				rule: { parameters: { test: { type: 1 } } },
				parents: [
					{
						name: "parameters",
						value: { test: { validate: 1 } },
					},
					{
						name: "test",
						value: { validate: 1 },
						type: "userInput",
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => {
			return validate.validate({
				current: {
					name: "validate",
					value: "foobar",
				},
				rule: { parameters: { test: { validate: 1 } } },
				parents: [
					{
						name: "parameters",
						value: { test: { validate: "foobar" } },
					},
					{
						name: "test",
						value: { validate: "foobar" },
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
		const mockFunction = jest.fn(({ name, value }) => {
			return new Promise((resolve, reject) => {
				resolve("newValue");
			});
		});
		await expect(validate.execute({
			rule: {
				current: {
					name: "validate",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { validate: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { validate: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { validate: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { validate: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { validate: mockFunction, type: "string" },
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
		await expect(validate.execute({
			rule: {
				current: {
					name: "validate",
					value: mockFunction,
				},
				initalRule: { body: { properties: { myVar: { validate: mockFunction, type: "string" } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { myVar: { validate: mockFunction, type: "string" } } } },
					},
					{
						name: "body",
						value: { properties: { myVar: { validate: mockFunction, type: "string" } } },
					},
					{
						name: "properties",
						value: { myVar: { validate: mockFunction, type: "string" } },
					},
					{
						name: "myVar",
						value: { validate: mockFunction, type: "string" },
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


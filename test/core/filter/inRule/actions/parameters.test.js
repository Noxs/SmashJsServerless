const { PARAMETERS } = require("../../../../../lib/core/filter/constant");

describe('Parameters', () => {
	let parameters = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/ruleProcessor");
		parameters = require("../../../../../lib/core/filter/inRule/actions/parameters");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(parameters.name).toBe(PARAMETERS);
		expect(parameters.execute).toBeFunction();
		expect(parameters.validate).toBeFunction();
		expect(parameters.config).toBeObject();
	});

	it('Test validate case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
		];
		expect(parameters.validate({
			current: {
				name: "parameters",
				value: { properties: { test: { castTo: "string" } } },
			},
			rule: { parameters: { properties: { test: { castTo: "string" } } } },
			parents: [
				{
					name: "none",
					value: { parameters: { properties: { test: { castTo: "string" } } } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(1);
	});

	it('Test validate case #2', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "userInput",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return parameters.validate({
				current: {
					name: "parameters",
					value: "string",
				},
				rule: { parameters: "string" },
				parents: [
					{
						name: "none",
						value: { parameters: "string" },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const mockedFunction = jest.fn(() => {
			return new Promise(resolve => {
				resolve(true);
			});
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "userInput",
				execute: mockedFunction,
				priority: 50,
			},
		];
		await expect(parameters.execute({
			rule: {
				current: {
					name: "parameters",
					value: {},
				},
				initalRule: { parameters: {} },
				parents: [
					{
						name: "none",
						value: { parameters: {} },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "parameters", value: {} },
				initialData: { parameters: {}, body: {} },
				parents: [{ name: "none", value: { parameters: {}, body: {} } }],
			},
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(0);
	});

	it('Test execute case #2', async () => {
		const mockedFunction = jest.fn(({ rule, data }) => {
			return new Promise(resolve => {
				expect(data.current.name).toBe("parameters");
				expect(data.current.value).toStrictEqual({ myVar: "123456789" });
				expect(data.initialData).toStrictEqual({ parameters: { myVar: "123456789" }, body: {} });
				expect(data.parents).toStrictEqual([{ name: "none", value: { parameters: { myVar: "123456789" }, body: {} } }]);
				resolve(true);
			});
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "properties",
				execute: mockedFunction,
				priority: 50,
			},
		];
		await expect(parameters.execute({
			rule: {
				current: {
					name: "parameters",
					value: { properties: { myVar: "123456789" } },
				},
				initalRule: { parameters: { properties: { myVar: "123456789" } } },
				parents: [
					{
						name: "none",
						value: { parameters: { properties: { myVar: "123456789" } } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "parameters", value: { myVar: "123456789" } },
				initialData: { parameters: { myVar: "123456789" }, body: {} },
				parents: [{ name: "none", value: { parameters: { myVar: "123456789" }, body: {} } }],
			},
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(1);
	});
});

const { USER_INPUT } = require("../../../../../lib/core/filter/constant");

describe('UserInput', () => {
	let userInput = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/inRule/inRuleProcessor");
		userInput = require("../../../../../lib/core/filter/inRule/actions/userInput");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(userInput.name).toBe(USER_INPUT);
		expect(userInput.execute).toBeFunction();
		expect(userInput.validate).toBeFunction();
		expect(userInput.config).toBeObject();
	});

	it('Test validate case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "castTo",
				validate: mockedFunction,
			},
		];
		expect(userInput.validate({
			current: {
				name: "test",
				value: { castTo: "string" },
			},

			rule: { parameters: { properties: { test: { castTo: "string" } } } },
			parents: [
				{
					name: "none",
					value: { parameters: { properties: { test: { castTo: "string" } } } },
				},
				{
					name: "parameters",
					value: { properties: { test: { castTo: "string" } } },
				},
				{
					name: "properties",
					value: { test: { castTo: "string" } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(2);
	});

	it('Test validate case #2', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "castTo",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return userInput.validate({
				current: {
					name: "test",
					value: { castTo: "string", mode: "forbiddenMode" },
				},
				rule: { parameters: { test: { castTo: "string", mode: "forbiddenMode" } } },
				parents: [
					{
						name: "parameters",
						value: { test: { castTo: "string", mode: "forbiddenMode" } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const mockedFunction = jest.fn(({ rule, data }) => {
			return new Promise(resolve => {
				expect(data.current.name).toBe("myVar");
				expect(data.current.value).toBe("123456789");
				expect(data.initialData).toStrictEqual({ parameters: { myVar: "123456789" }, body: {} });
				expect(data.parents).toStrictEqual([{ name: "none", value: { parameters: { myVar: "123456789" }, body: {} } }, { name: "parameters", value: { myVar: "123456789" } }]);
				resolve(true);
			});
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "castTo",
				execute: mockedFunction,
				priority: 20,
			},
			{
				name: "type",
				execute: mockedFunction,
				priority: 50,
			},
			{
				name: "optional",
				execute: mockedFunction,
				priority: 10,
			},
		];
		await expect(userInput.execute({
			rule: {
				current: {
					name: "myVar",
					value: { castTo: "string", type: "string" },
					type: "userInput",
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
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "123456789" },
				initialData: { parameters: { myVar: "123456789" }, body: {} },
				parents: [{ name: "none", value: { parameters: { myVar: "123456789" }, body: {} } }, { name: "parameters", value: { myVar: "123456789" } }],
			},
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(2);
	});

	it('Test execute case #2', async () => {
		const mockedFunction = jest.fn(() => {
			return new Promise(resolve => {
				resolve(true);
			});
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "userInput",
				execute: mockedFunction,
				priority: 50,
			},
		];
		await expect(userInput.execute({
			rule: {
				current: {
					name: "myVar",
					value: {},
					type: "userInput",
				},
				initalRule: { parameters: { myVar: {} } },
				parents: [
					{
						name: "none",
						value: { parameters: { myVar: {} } },
					},
					{
						name: "parameters",
						value: { myVar: {} },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "myVar", value: "123456789" },
				initialData: { parameters: { myVar: "123456789" }, body: {} },
				parents: [{ name: "none", value: { parameters: { myVar: "123456789" }, body: {} } }, { name: "parameters", value: { myVar: "123456789" } }],
			},
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(0);
	});
});


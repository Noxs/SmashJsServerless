const { USER_INPUT } = require("../../../../../lib/core/filter/constant");

describe('Mode', () => {
	let userInput = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/mergeRule/mergeRuleProcessor");
		userInput = require("../../../../../lib/core/filter/mergeRule/actions/userInput");
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
		const processor = new RuleProcessor("mergeRule");
		processor.modules = [
			{
				name: "type",
				validate: mockedFunction,
			},
		];
		expect(userInput.validate({
			current: {
				name: "test",
				value: { type: "string" },
				type: "userInput",
			},
			rule: { mode: "restrictive", properties: { test: { type: "string" } } },
			parents: [
				{
					name: "none",
					value: { mode: "restrictive", properties: { test: { type: "string" } } },
				},
				{
					name: "properties",
					value: { test: { type: "string" } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "mergeRule" },
		})).toBe(true);
	});

	it('Test execute case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("mergeRule");
		processor.modules = [
			{
				name: "type",
				execute: mockedFunction,
			},
		];
		const data = {
			current: { name: "properties", value: { foo: "bar", bar: "foo" } },
			initialData: { foo: "bar", bar: "foo" },
			parents: [{ name: "none", value: { foo: "bar", bar: "foo" } }],
		};
		expect(userInput.execute({
			rule: {
				current: {
					name: "foo",
					value: {},
				},
				initalRule: { mode: "restrictive", properties: { foo: {}, bar: {} } },
				parents: [
					{
						name: "none",
						value: { mode: "restrictive", properties: { foo: {}, bar: {} } },
					},
					{
						name: "properties",
						value: { foo: {}, bar: {} },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "mergeRule" },
				processor,
			},
			data,
		})).toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(0);
	});

	it('Test execute case #2', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("mergeRule");
		processor.modules = [
			{
				name: "type",
				execute: mockedFunction,
			},
		];
		const data = {
			current: { name: "none", value: { foo: "bar", bar: "foo" } },
			initialData: { foo: "bar", bar: "foo" },
			parents: [{ name: "none", value: { foo: "bar", bar: "foo" } }],
		};
		expect(userInput.execute({
			rule: {
				current: {
					name: "foo",
					value: { type: "string" },
				},
				initalRule: { mode: "restrictive", properties: { foo: { type: "string" }, bar: {} } },
				parents: [
					{
						name: "none",
						value: { mode: "restrictive", properties: { foo: { type: "string" }, bar: {} } },
					},
					{
						name: "properties",
						value: { foo: { type: "string" }, bar: {} },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "mergeRule" },
				processor,
			},
			data,
		})).toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(1);
	});
});


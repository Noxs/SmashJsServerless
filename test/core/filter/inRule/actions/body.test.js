const { BODY } = require("../../../../../lib/core/filter/constant");

describe('Body', () => {
	let body = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/ruleProcessor");
		body = require("../../../../../lib/core/filter/inRule/actions/body");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(body.name).toBe(BODY);
		expect(body.execute).toBeFunction();
		expect(body.validate).toBeFunction();
		expect(body.config).toBeObject();
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
			{
				name: "optional",
				validate: mockedFunction,
			},
			{
				name: "clean",
				validate: mockedFunction,
			},
		];
		expect(body.validate({
			current: {
				name: "body",
				value: { properties: { test: { type: "string" } } },
			},
			rule: { body: { properties: { test: { type: "string" } } } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "string" } } } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
			{
				name: "clean",
				validate: mockedFunction,
			},
		];
		expect(body.validate({
			current: {
				name: "body",
				value: { properties: { test: { type: "string" } }, optional: true },
			},
			rule: { body: { properties: { test: { type: "string" } }, optional: true } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "string" } }, optional: true } },
				},
			],
			processor,
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #3', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
			{
				name: "clean",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return body.validate({
				current: {
					name: "body",
					value: { properties: { test: { type: "string" } }, type: "foorbar" },
				},
				rule: { body: { properties: { test: { type: "string" } }, type: "foorbar" } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "string" } }, type: "foorbar" } },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #4', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
			{
				name: "clean",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return body.validate({
				current: {
					name: "body",
					value: "foobar",
				},
				rule: { body: "foobar" },
				parents: [
					{
						name: "none",
						value: { body: "foobar" },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #5', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor("inRule");
		processor.modules = [
			{
				name: "properties",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return body.validate({
				current: {
					name: "body",
					value: "foobar",
				},
				rule: { body: "foobar" },
				parents: [
					{
						name: "none",
						value: { body: "foobar" },
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});
});


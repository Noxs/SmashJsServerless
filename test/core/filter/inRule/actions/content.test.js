const { CONTENT } = require("../../../../../lib/core/filter/constant");

describe('content', () => {
	let content = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/inRule/inRuleProcessor");
		content = require("../../../../../lib/core/filter/inRule/actions/content");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(content.name).toBe(CONTENT);
		expect(content.execute).toBeFunction();
		expect(content.validate).toBeFunction();
		expect(content.config).toBeObject();
	});


	it('Test validate case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "optional",
				validate: mockedFunction,
			},
			{
				name: "userInput",
				validate: mockedFunction,
			},
			{
				name: "type",
				validate: mockedFunction,
			},
		];
		expect(content.validate({
			current: {
				name: "content",
				value: { type: "string" },
			},
			rule: { body: { properties: { test: { type: "array", content: { type: "string" } } } } },
			parents: [
				{
					name: "none",
					value: { body: { properties: { test: { type: "array", content: { type: "string" } } } } },
				},
				{
					name: "body",
					value: { properties: { test: { type: "array", content: { type: "string" } } } },
				},
				{
					name: "properties",
					value: { test: { type: "array", content: { type: "string" } } },
				},
				{
					name: "test",
					value: { type: "array", content: { type: "string" } },
					type: "userInput",
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
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "content",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return content.validate({
				current: {
					name: "content",
					value: { foo: { type: "string" }, bar: { type: "string" } },
				},
				rule: { body: { properties: { test: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } } } },
					},
					{
						name: "properties",
						value: { test: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } } },
					},
					{
						name: "test",
						value: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } },
						type: "userInput",
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		const processor = new RuleProcessor();
		processor.modules = [
			{
				name: "content",
				validate: mockedFunction,
			},
			{
				name: "optional",
				validate: mockedFunction,
			},
		];
		expect(() => {
			return content.validate({
				current: {
					name: "content",
					value: { type: "string" },
				},
				rule: { body: { properties: { test: { type: "object", content: { type: "string" } } } } },
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "object", content: { type: "string" } } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "object", content: { type: "string" } } } },
					},
					{
						name: "properties",
						value: { test: { type: "object", content: { type: "string" } } },
					},
					{
						name: "test",
						value: { type: "object", content: { type: "string" } },
						type: "userInput",
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
				if (data.current.name === 0) {
					expect(rule.current).toStrictEqual({
						name: 0,
						value: {
							type: "object",
							properties: { foo: { type: "string" }, bar: { type: "string" } },
						},
						type: "userInput",
					});
					expect(data.current.value).toStrictEqual({ yolo: "you shall not pass", foo: "bar", bar: "foo" });
				} else {
					expect(rule.current).toStrictEqual({
						name: 1,
						value: {
							type: "object",
							properties: { foo: { type: "string" }, bar: { type: "string" } },
						},
						type: "userInput",
					});
					expect(data.current.value).toStrictEqual({ foo: "foo", bar: "bar" });
				}
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
		await expect(content.execute({
			rule: {
				current: {
					name: "content",
					value: {
						type: "object",
						properties: {
							foo: { type: "string" },
							bar: { type: "string" },
						},
					},
				},
				initalRule: {
					body: {
						properties: {
							test: {
								type: "array",
								content: {
									type: "object",
									properties: {
										foo: { type: "string" },
										bar: { type: "string" },
									},
								},
							},
						},
					},
				},
				parents: [
					{
						name: "none",
						value: { body: { properties: { test: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } } } } },
					},
					{
						name: "body",
						value: { properties: { test: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } } } },
					},
					{
						name: "properties",
						value: { test: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } } },
					},
					{
						name: "test",
						value: { type: "array", content: { foo: { type: "string" }, bar: { type: "string" } } },
						type: "userInput",
					},
				],
				processor,
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current: { name: "test", value: [{ yolo: "you shall not pass", foo: "bar", bar: "foo" }, { foo: "foo", bar: "bar" }] },
				initialData: { parameters: {}, body: { test: [{ yolo: "you shall not pass", foo: "bar", bar: "foo" }, { foo: "foo", bar: "bar" }] } },
				parents: [
					{ name: "none", value: { parameters: {}, body: { test: [{ yolo: "you shall not pass", foo: "bar", bar: "foo" }, { foo: "foo", bar: "bar" }] } } },
					{ name: "body", value: { test: [{ yolo: "you shall not pass", foo: "bar", bar: "foo" }, { foo: "foo", bar: "bar" }] } },
				],
			},
		})).resolves.toBe(true);
		expect(mockedFunction.mock.calls.length).toBe(2);
	});
});


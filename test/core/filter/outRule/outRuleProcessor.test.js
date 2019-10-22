describe('RuleProcessor', () => {
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../smash');
		RuleProcessor = require("../../../../lib/core/filter/outRule/outRuleProcessor");
	});

	beforeEach(() => {

	});

	it('Test validate case #1', () => {
		const processor = new RuleProcessor();
		const rule = {
			type: "object",
			properties: [
				{
					name: "item",
					type: "array",
					content: {
						type: "object",
						properties: [
							{ name: "language" },
							{ name: "duration" },
							{ name: "preview" },
							{ name: "listToFilter" },
							{ name: "listToNotFilter" },
							{
								name: "foo",
								type: "object",
								properties: [
									{ name: "bar" },
								],
							},
						],
					},
				},
			],
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		expect(() => processor.validate(rule)).not.toThrow();
	});

	it('Test validate case #2', () => {
		const processor = new RuleProcessor();
		const rule = {
			type: "object",
			properties: [
				{ name: "item" },
			],
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		expect(() => processor.validate(rule)).not.toThrow();
	});

	it('Test validate case #3', () => {
		const processor = new RuleProcessor();
		const rule = {
			type: "object",
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		expect(() => processor.validate(rule)).toThrow();
	});


	it('Test validate case #4', () => {
		const processor = new RuleProcessor();
		const rule = {
			type: "object",
			properties: [
				{
					name: "item",
					type: "array",
					content: {
						type: "object",
						properties: [
							{ name: "language" },
							{ name: "duration" },
							{ name: "preview" },
							{
								name: "listToFilter",
								type: "array",
							},
							{
								name: "listToNotFilter",
								type: "array",
								content: {},
							},
							{
								name: "foo",
								type: "object",
								properties: [
									{ name: "bar" },
								],
							},
						],
					},
				},
			],
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		expect(() => processor.validate(rule)).toThrow();
	});

	it('Test identify case #1', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				type: "object",
				properties: [],
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("object");
	});

	it('Test identify case #2', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				type: "object",
				properties: {},
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(() => processor.identify(param)).toThrow();
	});

	it('Test identify case #3', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				type: "array",
				content: {},
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("array");
	});

	it('Test identify case #4', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				type: "array",
				content: [],
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(() => processor.identify(param)).toThrow();
	});

	it('Test identify case #5', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				name: "foo",
				type: "object",
				properties: [],
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("namedObject");
	});

	it('Test identify case #6', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				name: "foo",
				type: "array",
				properties: [],
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(() => processor.identify(param)).toThrow();
	});

	it('Test identify case #7', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				name: "foo",
				type: "array",
				content: {},
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("namedArray");
	});

	it('Test identify case #8', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				name: "foo",
				type: "object",
				content: {},
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(() => processor.identify(param)).toThrow();
	});

	it('Test identify case #9', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				name: "foo",
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("name");
	});

	it('Test identify case #10', () => {
		const processor = new RuleProcessor();
		const param = {
			current: {
				name: "foo",
				name2: "foo",
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(() => processor.identify(param)).toThrow();
	});

	it('Test process case #1', async () => {
		const processor = new RuleProcessor();
		const current = {
			items: [
				{
					language: "fr",
					duration: "123456789",
					preview: true,
					notPreview: true,
					listToFilter: [
						{
							keep: "yes",
							remove: "yes",
						},
						{
							keep: "no",
							remove: "no",
						},
					],
					listToNotFilter: [
						"yes",
						"no",
					],
					foo: { bar: "foobar" },
				},
				{
					language: "fr",
					duration: "123456789",
					test: "test",
					foo: "bar",
				},
			],
			toRemove: {
				foo: "bar",
			},
		};
		const rule = {
			type: "object",
			properties: [
				{
					name: "items",
					type: "array",
					content: {
						type: "object",
						properties: [
							{ name: "language" },
							{ name: "duration" },
							{ name: "preview" },
							{
								name: "listToFilter",
								type: "array",
								content: {
									type: "object",
									properties: [
										{ name: "keep" },
									],
								},
							},
							{ name: "listToNotFilter" },
							{
								name: "foo",
								type: "object",
								properties: [
									{ name: "bar" },
								],
							},
						],
					},
				},
			],
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		const data = await processor.process(rule, current);
		expect(data).toStrictEqual({
			items: [
				{
					language: "fr",
					duration: "123456789",
					preview: true,
					listToFilter: [
						{
							keep: "yes",
						},
						{
							keep: "no",
						},
					],
					listToNotFilter: [
						"yes",
						"no",
					],
					foo: { bar: "foobar" },
				},
				{
					language: "fr",
					duration: "123456789",
				},
			],
		});
	});

	it('Test process case #2', async () => {
		const processor = new RuleProcessor();
		const current = [
			{
				language: "fr",
				duration: "123456789",
				preview: true,
				notPreview: true,
				listToFilter: [
					{
						keep: "yes",
						remove: "yes",
					},
					{
						keep: "no",
						remove: "no",
					},
				],
				listToNotFilter: [
					"yes",
					"no",
				],
				foo: { bar: "foobar" },
			},
			{
				language: "fr",
				duration: "123456789",
				test: "test",
				foo: "bar",
			},
		];
		const rule = {
			type: "array",
			content: {
				type: "object",
				properties: [
					{ name: "language" },
					{ name: "duration" },
					{ name: "preview" },
					{
						name: "listToFilter",
						type: "array",
						content: {
							type: "object",
							properties: [
								{ name: "keep" },
							],
						},
					},
					{ name: "listToNotFilter" },
					{
						name: "foo",
						type: "object",
						properties: [
							{ name: "bar" },
						],
					},
				],
			},
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		const data = await processor.process(rule, current);
		expect(data).toStrictEqual([
			{
				language: "fr",
				duration: "123456789",
				preview: true,
				listToFilter: [
					{
						keep: "yes",
					},
					{
						keep: "no",
					},
				],
				listToNotFilter: [
					"yes",
					"no",
				],
				foo: { bar: "foobar" },
			},
			{
				language: "fr",
				duration: "123456789",
			},
		]);
	});

	it('Test process case #3', async () => {
		const processor = new RuleProcessor();
		const current = {
			items: [
				{
					language: "fr",
					duration: "123456789",
					preview: true,
					notPreview: true,
					listToFilter: [
						{
							keep: "yes",
							remove: "yes",
						},
						{
							keep: "no",
							remove: "no",
						},
					],
					listToNotFilter: [
						"yes",
						"no",
					],
					foo: { bar: "foobar" },
				},
				{
					language: "fr",
					duration: "123456789",
					test: "test",
					foo: "bar",
				},
			],
			toRemove: {
				foo: "bar",
			},
		};
		const rule = {
			type: "array",
			content: {
				type: "object",
				properties: [
					{ name: "language" },
					{ name: "duration" },
					{ name: "preview" },
					{
						name: "listToFilter",
						type: "array",
						content: {
							type: "object",
							properties: [
								{ name: "keep" },
							],
						},
					},
					{ name: "listToNotFilter" },
					{
						name: "foo",
						type: "object",
						properties: [
							{ name: "bar" },
						],
					},
				],
			},
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		const value = await processor.process(rule, current);
		expect(value).toStrictEqual([]);
	});

	it('Test process case #4', async () => {
		const processor = new RuleProcessor();
		const current = [
			{
				language: "fr",
				duration: "123456789",
				preview: true,
				notPreview: true,
				listToFilter: [
					{
						keep: "yes",
						remove: "yes",
					},
					{
						keep: "no",
						remove: "no",
					},
				],
				listToNotFilter: [
					"yes",
					"no",
				],
				foo: { bar: "foobar" },
			},
			{
				language: "fr",
				duration: "123456789",
				test: "test",
				foo: "bar",
			},
		];
		const rule = {
			type: "object",
			properties: [
				{
					name: "items",
					type: "array",
					content: {
						type: "object",
						properties: [
							{ name: "language" },
							{ name: "duration" },
							{ name: "preview" },
							{
								name: "listToFilter",
								type: "array",
								content: {
									type: "object",
									properties: [
										{ name: "keep" },
									],
								},
							},
							{ name: "listToNotFilter" },
							{
								name: "foo",
								type: "object",
								properties: [
									{ name: "bar" },
								],
							},
						],
					},
				},
			],
		};
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { version: "01-2019" },
		});
		const value = await processor.process(rule, current);
		expect(value).toStrictEqual({});
	});
});


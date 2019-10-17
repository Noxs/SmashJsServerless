describe('Validator', () => {
	let processor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../smash');
		processor = require("../../../../lib/core/filter/outRule/filterOut");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(processor.validate).toBeFunction();
	});

	it('Test validate case #1', () => {
		expect(() => processor.validate({
			current: {
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
			},
			ruleConfig: {
				version: "01-2019",
			},
		})).not.toThrow();
	});

	it('Test validate case #2', () => {
		expect(() => processor.validate({
			current: {
				type: "object",
				properties: [
					{ name: "item" },
				],
			},
			ruleConfig: {
				version: "01-2019",
			},
		})).not.toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => processor.validate({
			current: {
				type: "object",
			},
			ruleConfig: {
				version: "01-2019",
			},
		})).toThrow();
	});


	it('Test validate case #4', () => {
		expect(() => processor.validate({
			current: {
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
			},
			ruleConfig: {
				version: "01-2019",
			},
		})).toThrow();
	});

	it('Test identify case #1', () => {
		const param = {
			current: {
				type: "object",
				properties: [],
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("processObject");
	});

	it('Test identify case #2', () => {
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
		const param = {
			current: {
				type: "array",
				content: {},
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("processArray");
	});

	it('Test identify case #4', () => {
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
		expect(processor.identify(param).name).toStrictEqual("processNamedObject");
	});

	it('Test identify case #6', () => {
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
		expect(processor.identify(param).name).toStrictEqual("processNamedArray");
	});

	it('Test identify case #8', () => {
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
		const param = {
			current: {
				name: "foo",
			},
			ruleConfig: {
				version: "01-2019",
			},
		};
		expect(processor.identify(param).name).toStrictEqual("processName");
	});

	it('Test identify case #10', () => {
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

	it('Test execute case #1', () => {
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
		expect(() => processor.execute({
			rule: {
				current: {
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
				},
				ruleConfig: {
					version: "01-2019",
				},
			},
			data: {
				current,
			},
		})).not.toThrow();
		expect(current).toStrictEqual({
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

	it('Test execute case #2', () => {
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
		expect(() => processor.execute({
			rule: {
				current: {
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
				ruleConfig: {
					version: "01-2019",
				},
			},
			data: {
				current,
			},
		})).not.toThrow();
		expect(current).toStrictEqual([
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

	it('Test execute case #3', () => {
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
		const value = processor.execute({
			rule: {
				current: {
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
				ruleConfig: {
					version: "01-2019",
				},
			},
			data: {
				current,
			},
		});
		expect(value).toStrictEqual([]);
	});

	it('Test execute case #4', () => {
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
		const value = processor.execute({
			rule: {
				current: {
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
				},
				ruleConfig: {
					version: "01-2019",
				},
			},
			data: {
				current,
			},
		});
		expect(value).toStrictEqual({});
	});
});


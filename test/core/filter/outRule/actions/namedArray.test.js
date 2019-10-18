describe('NamedArray', () => {
	let namedArray = null;

	beforeAll(() => {
		jest.resetAllMocks();
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		require('../../../../../smash');
		namedArray = require("../../../../../lib/core/filter/outRule/actions/namedArray");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(namedArray.name).not.toBeUndefined();
		expect(namedArray.child).not.toBeUndefined();
		expect(namedArray.identify).toBeFunction();
		expect(namedArray.validate).toBeFunction();
		expect(namedArray.next).toBeFunction();
		expect(namedArray.execute).toBeFunction();
	});

	it('Test identify case #1', () => {
		const current = { name: "foobar", type: "array", content: {} };
		expect(namedArray.identify({ current })).toBeTrue();
	});

	it('Test identify case #2', () => {
		const current = { type: "object", content: [] };
		expect(namedArray.identify({ current })).toBeFalse();
	});

	it('Test identify case #3', () => {
		const current = { type: "array" };
		expect(namedArray.identify({ current })).toBeFalse();
	});

	it('Test identify case #4', () => {
		const current = { content: [] };
		expect(namedArray.identify({ current })).toBeFalse();
	});

	it('Test identify case #5', () => {
		const current = { type: "array", content: [] };
		expect(namedArray.identify({ current })).toBeFalse();
	});

	it('Test identify case #6', () => {
		const current = { name: "foorbar", type: "array" };
		expect(namedArray.identify({ current })).toBeFalse();
	});

	it('Test validate case #1', () => {
		const rule = {
			current: {
				name: "times",
				type: "array",
				content: {
					name: "yolo",
					type: "object",
					properties: [],
				},
			},
			ruleConfig: { version: "01-2019" },
			parents: [],
			processor: {
				identify: jest.fn(({ current }) => {
					expect(current).toStrictEqual({
						name: "yolo",
						type: "object",
						properties: [],
					});
					return {
						validate: jest.fn(() => {
							return true;
						}),
					};
				}),
			},
		};
		expect(namedArray.validate(rule)).toBeTrue();
		expect(rule.processor.identify.mock.calls.length).toBe(1);
	});

	it('Test next case #1', () => {
		const current = { name: "foobar", type: "array", content: { name: "yolo" } };
		expect(namedArray.next(current)).toStrictEqual({ name: "yolo" });
	});

	it('Test next case #2', () => {
		const current = { name: "foobar", type: "array", content: {} };
		expect(namedArray.next(current)).toStrictEqual({});
	});

	it('Test execute case #1', async () => {
		const processor = {
			executeNext: jest.fn(obj => obj.data.current),
		};
		await expect(namedArray.execute({
			data: {
				current: {
					foobar: [
						{
							foobar: "yolo",
							yolo: "foobar",
						},
					],
				},
			},
			rule: {
				current: {
					name: "foobar",
					type: "array",
					content: { type: "object" },
				},
			},
			processor,
		})).resolves.toStrictEqual({
			foobar: [
				{
					foobar: "yolo",
					yolo: "foobar",
				},
			],
		});
	});

	it('Test execute case #2', async () => {
		const processor = {
			executeNext: jest.fn(obj => obj.data.current),
		};
		await expect(namedArray.execute({
			data: {
				current: {
					foobar: {
						foobar: "yolo",
						yolo: "foobar",
					},
				},
			},
			rule: {
				current: {
					name: "foobar",
					type: "array",
					content: { type: "array" },
				},
			},
			processor,
		})).resolves.toStrictEqual({});
	});
});


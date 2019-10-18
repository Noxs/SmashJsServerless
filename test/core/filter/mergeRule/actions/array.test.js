describe('Array', () => {
	let array = null;

	beforeAll(() => {
		jest.resetAllMocks();
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		require('../../../../../smash');
		array = require("../../../../../lib/core/filter/mergeRule/actions/array");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(array.name).not.toBeUndefined();
		expect(array.child).not.toBeUndefined();
		expect(array.identify).toBeFunction();
		expect(array.validate).toBeFunction();
		expect(array.next).toBeFunction();
		expect(array.execute).toBeFunction();
	});

	it('Test identify case #1', () => {
		const current = { type: "array", content: {} };
		expect(array.identify({ current })).toBeTrue();
	});

	it('Test identify case #2', () => {
		const current = { type: "object", content: [] };
		expect(array.identify({ current })).toBeFalse();
	});

	it('Test identify case #3', () => {
		const current = { type: "array" };
		expect(array.identify({ current })).toBeFalse();
	});

	it('Test identify case #4', () => {
		const current = { content: [] };
		expect(array.identify({ current })).toBeFalse();
	});

	it('Test identify case #5', () => {
		const current = { type: "array", content: [] };
		expect(array.identify({ current })).toBeFalse();
	});

	it('Test validate case #1', () => {
		const rule = {
			current: {
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
		expect(array.validate(rule)).toBeTrue();
		expect(rule.processor.identify.mock.calls.length).toBe(1);
	});

	it('Test next case #1', () => {
		const current = { type: "array", content: { name: "yolo" } };
		expect(array.next(current)).toStrictEqual({ name: "yolo" });
	});

	it('Test next case #2', () => {
		const current = { type: "array", content: {} };
		expect(array.next(current)).toStrictEqual({});
	});

	it('Test execute case #1', async () => {
		const target = {
			current: [
				{
					foobar: "foobar",
					yolo: "yolo",
				},
				{
					foobar: "foobar",
					yolo: "yolo",
				},
			],
		};
		const source = {
			current: [
				{
					foobar: "foobar",
					yolo: "yolo",
				},
				{
					foobar: "foobar",
					yolo: "yolo",
				},
			],
		};
		const rule = {
			current: {
				type: "array",
				content: { type: "object", properties: [{ name: "foobar" }, { name: "yolo" }] },
			},
		};
		const processor = {
			executeNext: jest.fn(obj => obj.target.current),
		};
		await expect(array.execute({
			target,
			source,
			rule,
			processor,
		})).resolves.toStrictEqual([
			{
				foobar: "foobar",
				yolo: "yolo",
			},
			{
				foobar: "foobar",
				yolo: "yolo",
			},
		]);
	});

	it('Test execute case #2', async () => {
		const target = {
			current: [
				"foobar",
				"yolo",
			],
		};
		const source = {
			current: [
				"foobar",
				"yolo",
			],
		};
		const rule = {
			current: {
				type: "array",
				content: { type: "object" },
			},
		};
		const processor = {
			executeNext: jest.fn(obj => obj.target.current),
		};
		await expect(array.execute({
			target,
			source,
			rule,
			processor,
		})).resolves.toStrictEqual([
			"foobar",
			"yolo",
		]);
	});
});


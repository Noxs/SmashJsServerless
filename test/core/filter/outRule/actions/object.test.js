describe('Object', () => {
	let object = null;

	beforeAll(() => {
		jest.resetAllMocks();
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		require('../../../../../smash');
		object = require("../../../../../lib/core/filter/outRule/actions/object");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(object.name).not.toBeUndefined();
		expect(object.child).not.toBeUndefined();
		expect(object.identify).toBeFunction();
		expect(object.validate).toBeFunction();
		expect(object.next).toBeFunction();
		expect(object.execute).toBeFunction();
	});

	it('Test identify case #1', () => {
		const current = { type: "object", properties: [{ name: "yolo" }] };
		expect(object.identify({ current })).toBeTrue();
	});

	it('Test identify case #2', () => {
		const current = { type: "array", properties: [] };
		expect(object.identify({ current })).toBeFalse();
	});

	it('Test identify case #3', () => {
		const current = { type: "object" };
		expect(object.identify({ current })).toBeFalse();
	});

	it('Test identify case #4', () => {
		const current = { properties: [] };
		expect(object.identify({ current })).toBeFalse();
	});

	it('Test identify case #5', () => {
		const current = { type: "object", properties: {} };
		expect(object.identify({ current })).toBeFalse();
	});

	it('Test validate case #1', () => {
		const rule = {
			current: {
				type: "object",
				properties: [
					{
						name: "yolo",
						type: "object",
					},
				],
			},
			ruleConfig: { version: "01-2019" },
			parents: [],
			processor: {
				identify: jest.fn(({ current }) => {
					expect(current).toStrictEqual({
						name: "yolo",
						type: "object",
					});
					return {
						validate: jest.fn(() => {
							return true;
						}),
					};
				}),
			},
		};
		expect(object.validate(rule)).toBeTrue();
		expect(rule.processor.identify.mock.calls.length).toBe(1);
	});

	it('Test next case #1', () => {
		const current = { type: "object", properties: [{ name: "yolo" }] };
		expect(object.next(current)).toStrictEqual([{ name: "yolo" }]);
	});

	it('Test next case #2', () => {
		const current = { type: "object", properties: [] };
		expect(object.next(current)).toStrictEqual([]);
	});

	it('Test execute case #1', async () => {
		const processor = {
			executeNext: jest.fn(obj => obj.data.current),
		};
		await expect(object.execute({
			data: {
				current: {
					yolo: "foobar",
					foobar: "yolo",
				},
			},
			rule: {
				current: {
					type: "object",
					properties: [
						{ name: "yolo" },
					],
				},
			},
			processor,
		})).resolves.toStrictEqual({ yolo: "foobar" });
	});

	it('Test execute case #2', async () => {
		const processor = {
			executeNext: jest.fn(obj => obj.data.current),
		};
		await expect(object.execute({
			data: {
				current: ["foobar"],
			},
			rule: {
				current: {
					type: "object",
					properties: [
						{ name: "yolo" },
					],
				},
			},
			processor,
		})).resolves.toStrictEqual(undefined);
	});
});


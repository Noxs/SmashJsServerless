describe('Object', () => {
	let object = null;

	beforeAll(() => {
		jest.resetAllMocks();
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		require('../../../../../smash');
		object = require("../../../../../lib/core/filter/mergeRule/actions/object");
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

	it('Test identify case #6', () => {
		const current = { type: "object", properties: [], mode: "restrictive" };
		expect(object.identify({ current })).toBeTrue();
	});

	it('Test identify case #7', () => {
		const current = { type: "object", properties: [], mode: "permissive" };
		expect(object.identify({ current })).toBeTrue();
	});

	it('Test identify case #8', () => {
		const current = { type: "object", properties: [], mode: "foobar" };
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
		const target = {
			current: {
				yolo: "yolo",
				foobar: "foobar",
			},
		};
		const source = {
			current: {
				yolo: "foobar",
				foobar: "yolo",
			},
		};
		const rule = {
			current: {
				type: "object",
				properties: [
					{ name: "yolo" },
				],
			},
		};
		const processor = {
			executeNext: jest.fn(obj => obj.target.current),
		};
		await expect(object.execute({
			source,
			target,
			rule,
			processor,
		})).resolves.toStrictEqual({
			yolo: "yolo",
			foobar: "foobar",
		});
	});
});


describe('NamedArray', () => {
	let namedObject = null;

	beforeAll(() => {
		jest.resetAllMocks();
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		require('../../../../../smash');
		namedObject = require("../../../../../lib/core/filter/outRule/actions/namedObject");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(namedObject.name).not.toBeUndefined();
		expect(namedObject.child).not.toBeUndefined();
		expect(namedObject.identify).toBeFunction();
		expect(namedObject.validate).toBeFunction();
		expect(namedObject.next).toBeFunction();
		expect(namedObject.execute).toBeFunction();
	});

	it('Test identify case #1', () => {
		const current = { name: "foobar", type: "object", properties: [] };
		expect(namedObject.identify({ current })).toBeTrue();
	});

	it('Test identify case #2', () => {
		const current = { type: "object", properties: {} };
		expect(namedObject.identify({ current })).toBeFalse();
	});

	it('Test identify case #3', () => {
		const current = { type: "object" };
		expect(namedObject.identify({ current })).toBeFalse();
	});

	it('Test identify case #4', () => {
		const current = { properties: [] };
		expect(namedObject.identify({ current })).toBeFalse();
	});

	it('Test identify case #5', () => {
		const current = { type: "object", properties: [] };
		expect(namedObject.identify({ current })).toBeFalse();
	});


	it('Test validate case #1', () => {
		const rule = {
			current: {
				name: "times",
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
		expect(namedObject.validate(rule)).toBeTrue();
		expect(rule.processor.identify.mock.calls.length).toBe(1);
	});


	it('Test next case #1', () => {
		const current = { name: "foobar", type: "object", properties: [{ name: "yolo" }] };
		expect(namedObject.next(current)).toStrictEqual([{ name: "yolo" }]);
	});

	it('Test next case #2', () => {
		const current = { name: "foobar", type: "object", properties: [] };
		expect(namedObject.next(current)).toStrictEqual([]);
	});

	it('Test execute case #1', async () => {
		const processor = {
			executeNext: jest.fn(obj => obj.data.current),
		};
		await expect(namedObject.execute({
			data: {
				current: {
					foobar: {
						foobar2: "yolo",
						yolo: "foobar",
					},
				},
			},
			rule: {
				current: {
					name: "foobar",
					type: "object",
					properties: [{ name: "yolo" }],
				},
			},
			processor,
		})).resolves.toStrictEqual({
			foobar: {
				yolo: "foobar",
			},
		});
	});

	it('Test execute case #2', async () => {
		const processor = {
			executeNext: jest.fn(obj => obj.data.current),
		};
		await expect(namedObject.execute({
			data: {
				current: {
					foobar: ["yolo", "foobar"],
				},
			},
			rule: {
				current: {
					name: "foobar",
					type: "object",
					properties: [{ name: "yolo" }],
				},
			},
			processor,
		})).resolves.toStrictEqual({});
	});
});


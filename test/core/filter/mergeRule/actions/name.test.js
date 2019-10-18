describe('Name', () => {
	let name = null;

	beforeAll(() => {
		jest.resetAllMocks();
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		require('../../../../../smash');
		name = require("../../../../../lib/core/filter/mergeRule/actions/name");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(name.name).not.toBeUndefined();
		expect(name.child).not.toBeUndefined();
		expect(name.identify).toBeFunction();
		expect(name.validate).toBeFunction();
		expect(name.next).toBeFunction();
		expect(name.execute).toBeFunction();
	});

	it('Test identify case #1', () => {
		const current = { name: "items" };
		expect(name.identify({ current })).toBeTrue();
	});

	it('Test identify case #2', () => {
		const current = { name: "items", beforeMerge: () => { } };
		expect(name.identify({ current })).toBeTrue();
	});

	it('Test identify case #3', () => {
		const current = { name: "items", foo: "bar" };
		expect(name.identify({ current })).toBeFalse();
	});

	it('Test validate', () => {
		expect(name.validate()).toBeTrue();
	});

	it('Test next', () => {
		expect(name.next()).toBe(null);
	});

	it('Test execute case #1', async () => {
		const target = {
			current: {
				foo: "foobar",
			},
		};
		const source = {
			current: {
				foo: "bar",
			},
		};
		const rule = {
			current: {
				name: "foo",
			},
		};
		await expect(name.execute({ target, source, rule })).resolves.toStrictEqual(source.current);
	});

	it('Test execute case #2', async () => {
		const target = {
			current: {
				foo: "foobar",
			},
		};
		const source = {
			current: {
				foo: "bar",
			},
		};
		const rule = {
			current: {
				name: "foo",
				beforeMerge: jest.fn(() => {
					return new Promise(resolve => {
						resolve("foo");
					});
				}),
			},
		};
		await expect(name.execute({ target, source, rule })).resolves.toStrictEqual({ foo: "foo" });
		expect(rule.current.beforeMerge.mock.calls.length).toBe(1);
	});

	it('Test execute case #3', async () => {
		const target = {
			current: {
				foo: "foobar",
			},
		};
		const source = {
			current: {
				foo: "bar",
			},
		};
		const rule = {
			current: {
				name: "foo",
				beforeMerge: jest.fn(() => {
					return "YOLO";
				}),
			},
		};
		await expect(name.execute({ target, source, rule })).resolves.toStrictEqual({ foo: "YOLO" });
		expect(rule.current.beforeMerge.mock.calls.length).toBe(1);
	});

	it('Test execute case #4', async () => {
		const target = {
			current: {
				foo: "foobar",
			},
		};
		const source = {
			current: {

			},
		};
		const rule = {
			current: {
				name: "foo",
				beforeMerge: jest.fn(() => {
					return "YOLO";
				}),
			},
		};
		await expect(name.execute({ target, source, rule })).resolves.toStrictEqual({ foo: "YOLO" });
		expect(rule.current.beforeMerge.mock.calls.length).toBe(1);
	});

	it('Test execute case #5', async () => {
		const target = {
			current: {
				foo: "foobar",
			},
		};
		const source = {
			current: {
			},
		};
		const rule = {
			current: {
				name: "foo",
			},
		};
		await expect(name.execute({ target, source, rule })).resolves.toStrictEqual({ foo: "foobar" });
	});
});


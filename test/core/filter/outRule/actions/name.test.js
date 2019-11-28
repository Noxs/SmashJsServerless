describe('Name', () => {
	let name = null;

	beforeAll(() => {
		jest.resetAllMocks();
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		require('../../../../../smash');
		name = require("../../../../../lib/core/filter/outRule/actions/name");
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
		const current = { name: "items", foo: "bar" };
		expect(name.identify({ current })).toBeFalse();
	});

	it('Test validate', () => {
		expect(name.validate()).toBeTrue();
	});

	it('Test next', () => {
		expect(name.next()).toBe(null);
	});

	it('Test execute', async () => {
		const current = {
			foo: "bar",
		};
		await expect(name.execute({ data: { current }, rule: { current } })).resolves.toStrictEqual(current);
	});
});


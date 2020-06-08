const { PERMISSION } = require("../../../../../lib/core/filter/constant");

describe('Permission', () => {
	let permission = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		permission = require("../../../../../lib/core/filter/inRule/actions/permission");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(permission.name).toBe(PERMISSION);
		expect(permission.execute).toBeFunction();
		expect(permission.validate).toBeFunction();
		expect(permission.config).toBeObject();
	});

	it('Test validate case #1', () => {
		const mockedFunction = jest.fn(() => {
			return true;
		});
		expect(permission.validate({
			current: {
				name: "permission",
				value: mockedFunction,
			},
			rule: { permission: mockedFunction },
			parents: [
				{
					name: "none",
					value: { permission: mockedFunction },
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
		})).toBe(true);
	});

	it('Test validate case #2', () => {
		expect(() => {
			return permission.validate({
				current: {
					name: "permission",
					value: 1,
				},
				rule: { permission: 1 },
				parents: [
					{
						name: "none",
						value: { permission: 1 },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test validate case #3', () => {
		expect(() => {
			return permission.validate({
				current: {
					name: "permission",
					value: "foobar",
				},
				rule: { permission: "foobar" },
				parents: [
					{
						name: "none",
						value: { permission: "foobar" },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			});
		}).toThrow();
	});

	it('Test execute case #1', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(() => {
			return new Promise((resolve, reject) => {
				resolve("newValue");
			});
		});
		await expect(permission.execute({
			rule: {
				current: {
					name: "permission",
					value: mockFunction,
				},
				initalRule: { permission: mockFunction },
				parents: [
					{
						name: "none",
						value: { permission: mockFunction },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: undefined } } }, { name: "body", value: { myVar: undefined } }],
			},
		})).resolves.toBe(true);
	});

	it('Test execute case #2', async () => {
		const initialData = { parameters: {}, body: {} };
		const current = { name: "myVar", value: undefined };
		const mockFunction = jest.fn(() => {
			return new Promise((resolve, reject) => {
				reject(new Error());
			});
		});
		await expect(permission.execute({
			rule: {
				current: {
					name: "permission",
					value: mockFunction,
				},
				initalRule: { permission: mockFunction },
				parents: [
					{
						name: "none",
						value: { permission: mockFunction },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "inRule" },
			},
			data: {
				current,
				initialData,
				parents: [{ name: "none", value: { parameters: {}, body: { myVar: undefined } } }, { name: "body", value: { myVar: undefined } }],
			},
		})).rejects.toThrow();
	});
});


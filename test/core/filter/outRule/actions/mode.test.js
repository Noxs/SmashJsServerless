const { MODE } = require("../../../../../lib/core/filter/constant");

describe('Mode', () => {
	let mode = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		mode = require("../../../../../lib/core/filter/outRule/actions/mode");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(mode.name).toBe(MODE);
		expect(mode.execute).toBeFunction();
		expect(mode.validate).toBeFunction();
		expect(mode.config).toBeObject();
	});


	it('Test validate case #1', () => {
		expect(mode.validate({
			current: {
				name: "mode",
				value: "restrictive",
			},
			rule: { mode: "restrictive", properties: { test: { type: "string" } } },
			parents: [
				{
					name: "none",
					value: { mode: "restrictive", properties: { test: { type: "string" } } },
				},
			],
			ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
		})).toBe(true);
	});

	it('Test execute case #1', async () => {
		const data = {
			current: { name: "none", value: { foo: "bar", bar: "foo" } },
			initialData: { foo: "bar", bar: "foo" },
			parents: [{ name: "none", value: { foo: "bar", bar: "foo" } }],
		};
		await expect(mode.execute({
			rule: {
				current: {
					name: "mode",
					value: "restrictive",
				},
				initalRule: { mode: "restrictive", properties: { foo: {}, bar: {} } },
				parents: [
					{
						name: "none",
						value: { mode: "restrictive", properties: { foo: {}, bar: {} } },
					},
				],
				ruleConfig: { version: "01-2019", action: "MyFooBarAction", type: "outRule" },
			},
			data,
		})).resolves.toBe(true);
		expect(data).toStrictEqual({
			current: { name: "none", value: { foo: "bar", bar: "foo" } },
			initialData: { foo: "bar", bar: "foo" },
			parents: [{ name: "none", value: { foo: "bar", bar: "foo" } }],
			mode: "restrictive",
		});
	});
});


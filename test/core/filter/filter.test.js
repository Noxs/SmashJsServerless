describe('Filter', () => {
	beforeAll(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
		jest.resetModules();
	});

	beforeEach(() => {

	});

	describe('Filter', () => {
		let Filter = null;

		beforeAll(() => {
			jest.clearAllMocks();
			jest.resetAllMocks();
			jest.resetModules();
			Filter = require("../../../lib/core/filter/filter");
		});

		beforeEach(() => {

		});

		it('Test cleanIn case #1', async () => {
			const validateDurationMocked = jest.fn(({ name, value }) => {
				return true;
			});

			const validateDeliveryMocked = jest.fn(({ name, value }) => {
				return true;
			});

			const validateCustomUrlMocked = jest.fn(({ name, value }) => {
				return true;
			});

			const defaultDomainMocked = jest.fn(({ name, value }) => {
				return "myDomain";
			});

			const request = {
				parameters: { id: "123456789" },
				body: {
					language: "fr",
					duration: 123,
					titleToClean: "YOLO",
					preview: "FULL",
				},
			};

			const requestCleaned = {
				parameters: { id: "123456789" },
				body: {
					language: "fr",
					duration: 123,
					preview: "FULL",
					domain: "myDomain",
				},
			};

			const filter = new Filter();

			expect(() => filter.for({ action: "MyFooBarAction", version: "01-2019" }).inRule({
				parameters: {
					properties: {
						id: { castTo: "string" },
					},
				},
				body: {
					properties: {
						language: { type: 'string', match: "^[A-Za-z]{2}(-[A-Za-z]{2})?$", optional: true },
						duration: { type: 'unsigned integer', optional: true, validate: validateDurationMocked },
						title: { type: 'string', optional: true },
						delivery: {
							type: "object",
							optional: true,
							validate: validateDeliveryMocked,
							properties: {
								sender: { type: "string", optional: true },
								receiver: { type: "array", optional: true, properties: { type: "string" } },
							},
						},
						preview: { type: "string", optional: true, match: "^(NONE|FULL)$" },
						password: { type: 'string', optional: true, match: "^.+$" },
						type: { type: 'string', optional: true, match: "^(NONE|ALL)$" },
						description: { type: 'string', optional: true, match: "^.+$" },
						domain: { type: 'string', match: "^.+$", optional: true, default: defaultDomainMocked },
						customUrl: { type: 'string', optional: true, match: "^.+$", validate: validateCustomUrlMocked },
					},
					optional: true,
				},
			})).not.toThrow();

			await expect(filter.cleanIn({ action: "MyFooBarAction", version: "01-2019" }, request)).resolves.not.toBeUndefined();
			expect(request).toStrictEqual(requestCleaned);
		});

		it('Test cleanOut case #1', async () => {
			const data = {
				language: "fr",
				duration: 123,
				titleToClean: "YOLO",
				preview: "FULL",
				listToFilter: [1, "test"],
				foo: { bar: "foo", toRemove: true },
			};

			const dataCleaned = {
				language: "fr",
				duration: 123,
				preview: "FULL",
				listToFilter: ["test"],
				foo: { bar: "foo" },
			};

			const filter = new Filter();

			expect(() => filter.for({ action: "MyFooBarAction", version: "01-2019" }).outRule({
				properties: {
					language: { type: 'string' },
					duration: { type: 'unsigned integer' },
					preview: { type: "string" },
					listToFilter: { type: "array", properties: { type: "string" } },
					foo: { type: "object", properties: { bar: { type: "string" } } },
				},
			})).not.toThrow();
			await expect(filter.cleanOut({ action: "MyFooBarAction", version: "01-2019" }, data)).resolves.not.toBeUndefined();
			expect(data).toStrictEqual(dataCleaned);
		});
	});

	describe('Filter mocked', () => {
		let Filter = null;
		beforeAll(() => {
			jest.resetModules();
			jest.resetAllMocks();
			jest.mock("../../../lib/core/filter/processor");
			Filter = require("../../../lib/core/filter/filter");
		});

		beforeEach(() => {

		});

		it('Test constructor', () => {
			const filter = new Filter();
			expect(filter.rules).toStrictEqual({});
			expect(filter.currentConfig).toStrictEqual(null);
		});

		it('Test for', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const filter = new Filter();
			expect(filter.currentConfig).toStrictEqual(null);
			filter.for(config);
			expect(filter.currentConfig).toStrictEqual(config);
		});


		it('Test _createKeyIfNotExist', () => {
			const key = "action";
			const value = "MyFooBarAction";
			const filter = new Filter();
			const input = {};
			filter._createKeyIfNotExist(input, key, value);
			expect(input).toStrictEqual({ action: { "MyFooBarAction": {} } });
		});

		it('Test _registerRule success case #1', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for(config);
			filter._registerRule("inRule", rule);
			expect(filter.rules).toStrictEqual({ action: { "MyFooBarAction": { type: { "inRule": { version: { "01-2019": { rule: { foo: {}, bar: {} } } } } } } } });
		});

		it('Test _registerRule success failure #1', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for(config);
			filter._registerRule("inRule", rule);
			expect(() => filter._registerRule("inRule", rule)).toThrow();
		});

		it('Test _registerRule success failure #1', () => {
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for({ action: "MyFooBarAction", version: "01-2019" });
			filter._registerRule("inRule", rule);
			filter.for({ action: "MyFooBarAction" });
			expect(() => filter._registerRule("inRule", rule)).toThrow();
		});

		it('Test _applyCurrentConfig', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for(config);
			const modifiedRule = filter._applyCurrentConfig("inRule", rule);
			expect(modifiedRule).toStrictEqual({ foo: {}, bar: {} });
			expect(modifiedRule._currentConfig).toBeObject();
		});

		it('Test _rule error case #1', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const rule = { foo: {}, bar: {}, error: "this will trigger an error" };
			const filter = new Filter();
			filter.for(config);
			expect(() => filter._rule("inRule", rule)).toThrow();
		});

		it('Test inRule', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for(config).inRule(rule);
			expect(filter.rules).toStrictEqual({ action: { "MyFooBarAction": { type: { "inRule": { version: { "01-2019": { rule: { foo: {}, bar: {} } } } } } } } });
		});

		it('Test mergeRule', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for(config);
			filter.for(config).mergeRule(rule);
			expect(filter.rules).toStrictEqual({ action: { MyFooBarAction: { type: { "mergeRule": { version: { "01-2019": { rule: { foo: {}, bar: {} } } } } } } } });
		});

		it('Test outRule', () => {
			const config = { action: "MyFooBarAction", version: "01-2019" };
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for(config);
			filter.for(config).outRule(rule);
			expect(filter.rules).toStrictEqual({ action: { "MyFooBarAction": { type: { "outRule": { version: { "01-2019": { rule: { foo: {}, bar: {} } } } } } } } });
		});

		it('Test getMatchingRule success case #1', () => {
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for({ action: "NotMyFooBarAction", version: "01-2019" }).inRule(rule).mergeRule(rule).outRule(rule);
			filter.for({ action: "MyFooBarAction", version: "01-2019" }).inRule(rule).mergeRule(rule).outRule(rule);
			const matchingRule = filter.getMatchingRule({ type: "inRule", path: "/foo/bar", action: "MyFooBarAction", version: "01-2019", options: { foo: "bar" } });
			expect(matchingRule).toStrictEqual({ foo: {}, bar: {} });
		});

		it('Test getMatchingRule success case #2', () => {
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for({ action: "MyFooBarAction" }).inRule(rule).mergeRule(rule).outRule(rule);
			filter.for({ action: "MyFooBarAction", version: "01-2019" }).inRule(rule).mergeRule(rule).outRule(rule);
			const matchingRule = filter.getMatchingRule({ type: "inRule", path: "/foo/bar", action: "MyFooBarAction", version: "01-2019", options: { foo: "bar" } });
			expect(matchingRule).toStrictEqual({ foo: {}, bar: {} });
		});

		it('Test getMatchingRule success case #3', () => {
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for({ action: "MyFooBarAction" }).inRule(rule).mergeRule(rule).outRule(rule);
			const matchingRule = filter.getMatchingRule({ type: "inRule", path: "/foo/bar", action: "MyFooBarAction", version: "01-2019", options: { foo: "bar" } });
			expect(matchingRule).toStrictEqual({ foo: {}, bar: {} });
		});

		it('Test getMatchingRule failure case #1', () => {
			const filter = new Filter();
			const matchingRule = filter.getMatchingRule({ type: "inRule", path: "/foo/bar", action: "MyFooBarAction", version: "01-2019", options: { foo: "bar" } });
			expect(matchingRule).toBe(null);
		});

		it('Test getMatchingRule failure case #2', () => {
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for({ action: "MyFooBarAction" }).inRule(rule).mergeRule(rule).outRule(rule);
			filter.for({ action: "MyFooBarAction", version: "02-2019" }).inRule(rule).mergeRule(rule).outRule(rule);
			const matchingRule = filter.getMatchingRule({ type: "inRule", path: "/foo/bar", action: "MyFooBarAction", version: "01-2019", options: { foo: "bar" } });
			expect(matchingRule).toStrictEqual(null);
		});

		it('Test getMatchingRule failure case #3', () => {
			const rule = { foo: {}, bar: {} };
			const filter = new Filter();
			filter.for({ action: "MyFooBarAction" }).inRule(rule).mergeRule(rule).outRule(rule);
			filter.for({ action: "MyFooBarAction", version: "01-2019" }).inRule(rule).mergeRule(rule).outRule(rule);
			const matchingRule = filter.getMatchingRule({ type: "inRule", path: "/foo/bar", action: "MyFooBarAction", options: { foo: "bar" } });
			expect(matchingRule).toStrictEqual(null);
		});

		it('Test cleanIn', async () => {

		});

		it('Test merge', async () => {

		});

		it('Test cleanOut', async () => {

		});
	});
});


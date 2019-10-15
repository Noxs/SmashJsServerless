describe('RuleProcessor', () => {
	describe('RuleProcessor mocked', () => {
		let RuleProcessor = null;

		beforeAll(() => {
			jest.resetAllMocks();
			require('../../../smash');
			jest.mock("../../../lib/core/filter/util/moduleLoader");
			RuleProcessor = require("../../../lib/core/filter/ruleProcessor");
		});

		beforeEach(() => {

		});

		it('Test constructor', () => {
			expect(() => new RuleProcessor("inRule")).not.toThrow();
		});

		it('Test validate case #1', () => {
			const rule = { test: {} };
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { version: "01-2019" },
			});
			const processor = new RuleProcessor("inRule");
			const mockFunction = jest.fn(({ current, parents, rule, processor, ruleConfig }) => {
				expect(current).not.toBeUndefined();
				expect(parents).toStrictEqual([{ name: "none", value: rule }]);
				expect(rule).toStrictEqual(rule);
				expect(processor).toStrictEqual(processor);
				expect(ruleConfig).toStrictEqual({ version: "01-2019" });
			});
			processor.modules = [
				{
					name: "test",
					validate: mockFunction,
				},
			];
			expect(() => processor.validate(rule)).not.toThrow();
			expect(mockFunction.mock.calls.length).toBe(1);
		});

		it('Test validate case #2', () => {
			const rule = { test: {}, foobar: "", foobar2: { foo: "bar" } };
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { version: "01-2019" },
			});
			const processor = new RuleProcessor("inRule");
			const mockFunction = jest.fn(({ current, parents, rule, processor, ruleConfig }) => {
				expect(current).not.toBeUndefined();
				expect(parents).toStrictEqual([{ name: "none", value: rule }]);
				expect(rule).toStrictEqual(rule);
				expect(processor).toStrictEqual(processor);
				expect(ruleConfig).toStrictEqual({ version: "01-2019" });
			});
			const mockFunction2 = jest.fn(({ current, parents, rule, processor, ruleConfig }) => {
				expect(current).toStrictEqual({ name: "foobar2", value: { foo: "bar" } });
				expect(parents).toStrictEqual([{ name: "none", value: rule }]);
				expect(rule).toStrictEqual(rule);
				expect(processor).toStrictEqual(processor);
				expect(ruleConfig).toStrictEqual({ version: "01-2019" });
			});
			processor.modules = [
				{
					name: "test",
					validate: mockFunction,
				},
				{
					name: "foobar",
					validate: mockFunction,
				},
				{
					name: "foobar2",
					validate: mockFunction2,
				},
			];
			expect(() => processor.validate(rule)).not.toThrow();
			expect(mockFunction.mock.calls.length).toBe(2);
		});

		it('Test validate case #3', () => {
			const rule = { test: {}, notfound: "" };
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { version: "01-2019" },
			});
			const processor = new RuleProcessor("inRule");
			const mockFunction = jest.fn(({ current, parents, rule, processor, ruleConfig }) => {
				expect(current).toStrictEqual({});
				expect(parents).toStrictEqual([{ name: "none", value: rule }]);
				expect(rule).toStrictEqual(rule);
				expect(processor).toStrictEqual(processor);
				expect(ruleConfig).toStrictEqual({ version: "01-2019" });
			});
			processor.modules = [
				{
					name: "test",
					validate: mockFunction,
				},
				{
					name: "foobar",
					validate: mockFunction,
				},
			];
			expect(() => processor.validate(rule)).toThrow();
			expect(mockFunction.mock.calls.length).toBe(1);
		});
	});
});


describe('Processor', () => {
	describe('Processor mocked', () => {
		let Processor = null;
		beforeAll(() => {
			jest.resetModules();
			jest.resetAllMocks();
			jest.mock("../../../lib/core/filter/inRule/inRuleProcessor");
			jest.mock("../../../lib/core/filter/mergeRule/mergeRuleProcessor");
			jest.mock("../../../lib/core/filter/outRule/outRuleProcessor");
			Processor = require("../../../lib/core/filter/processor");
		});

		beforeEach(() => {

		});

		it('Test constructor', () => {
			const processor = new Processor();
			expect(processor.rule).toBe(null);
			expect(processor.inData).toBe(null);
			expect(processor.outData).toBe(null);
		});

		it('Test use case #1', async () => {
			const rule = {};
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { type: "inRule" },
			});
			const processor = new Processor();
			const result = processor.use(rule);
			expect(result).toStrictEqual(processor);
			expect(result.rule).toStrictEqual(rule);
			await expect(processor.to({ parameters: {}, body: {} })).resolves.not.toThrow();
		});

		it('Test use case #2', async () => {
			const rule = {};
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { type: "inRule" },
			});
			const processor = new Processor();
			const result = processor.use(rule);
			expect(result).toStrictEqual(processor);
			expect(result.rule).toStrictEqual(rule);
			await expect(processor.to({ parameters: {}, body: {} })).resolves.not.toThrow();
		});

		it('Test use case #3', async () => {
			const rule = {};
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { type: "inRule" },
			});
			const processor = new Processor();
			const result = processor.use(rule);
			expect(result).toStrictEqual(processor);
			await expect(processor.to({ parameters: {}, body: {} })).resolves.not.toThrow();
		});

		it('Test to', async () => {
			const rule = {};
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { type: "inRule" },
			});
			const processor = new Processor();
			const result = processor.to({ parameters: {}, body: {} });
			expect(result).toStrictEqual(processor);
			await expect(processor.use(rule)).resolves.not.toThrow();
		});

		it('Test from case #1', async () => {
			const rule = {};
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { type: "mergeRule" },
			});
			const processor = new Processor();
			processor.use(rule).from({ dataToCopy: "to copy" });
			expect(processor.rule).toStrictEqual(rule);
			expect(processor.inData).toStrictEqual({ dataToCopy: "to copy" });
			await expect(processor.to({ dataToKeep: "to keep" })).resolves.not.toThrow();
		});

		it('Test from case #2', async () => {
			const rule = {};
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { type: "mergeRule" },
			});
			const processor = new Processor();
			processor.from({ dataToCopy: "to copy" }).to({ dataToKeep: "to keep" });
			expect(processor.outData).toStrictEqual({ dataToKeep: "to keep" });
			expect(processor.inData).toStrictEqual({ dataToCopy: "to copy" });
			await expect(processor.use(rule)).resolves.not.toThrow();
		});

		it('Test from case #3', async () => {
			const rule = {};
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { type: "mergeRule" },
			});
			const processor = new Processor();
			processor.use(rule).from({ dataToCopy: "to copy" });
			expect(processor.rule).toStrictEqual(rule);
			expect(processor.inData).toStrictEqual({ dataToCopy: "to copy" });
			await expect(processor.to({ dataToKeep: "to keep" })).resolves.not.toThrow();
		});

		it('Test validate', async () => {
			const processor = new Processor();
			await expect(() => processor.validate("inRule", {})).not.toThrow();
		});
	});

	describe('Processor', () => {
		beforeAll(() => {

		});

		beforeEach(() => {

		});
	});
});


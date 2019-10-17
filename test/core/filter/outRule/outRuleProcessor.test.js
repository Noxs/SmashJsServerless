describe('RuleProcessor', () => {
	describe('RuleProcessor mocked', () => {
		let RuleProcessor = null;

		beforeAll(() => {
			RuleProcessor = require("../../../../lib/core/filter/outRule/outRuleProcessor");
		});

		beforeEach(() => {

		});


		it('Test constructor', () => {
			expect(() => new RuleProcessor()).not.toThrow();
		});
	});
});


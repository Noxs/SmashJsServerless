const { MODE } = require("../../../../../lib/core/filter/constant");

describe('Mode', () => {
	let mode = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/ruleProcessor");
		mode = require("../../../../../lib/core/filter/mergeRule/actions/mode");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(mode.name).toBe(MODE);
		expect(mode.execute).toBeFunction();
		expect(mode.validate).toBeFunction();
		expect(mode.config).toBeObject();
	});
});


const { BEFORE_MERGE } = require("../../../../../lib/core/filter/constant");

describe('BeforeMerge', () => {
	let beforeMerge = null;
	let RuleProcessor = null;

	beforeAll(() => {
		jest.resetAllMocks();
		require('../../../../../smash');
		jest.mock("../../../../../lib/core/filter/util/moduleLoader");
		RuleProcessor = require("../../../../../lib/core/filter/ruleProcessor");
		beforeMerge = require("../../../../../lib/core/filter/mergeRule/actions/beforeMerge");
	});

	beforeEach(() => {

	});

	it('Test initial', () => {
		expect(beforeMerge.name).toBe(BEFORE_MERGE);
		expect(beforeMerge.execute).toBeFunction();
		expect(beforeMerge.validate).toBeFunction();
		expect(beforeMerge.config).toBeObject();
	});
});


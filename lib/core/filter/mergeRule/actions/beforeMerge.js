const { isString, typeError, validateSiblings, validateChild, getLatestFromNames } = require("../../util/ruleUtil");
const { TYPE, BEFORE_MERGE, STRING, FUNCTION } = require("../../constant");

const depth = 1;
const config = {
	none: {
		siblings: [
			{ name: TYPE },
		],
		children: { types: [FUNCTION] },
	},
};

module.exports = {
	name: BEFORE_MERGE,
	priority: 10,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	//TODO
	return true;
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, BEFORE_MERGE);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isString(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: STRING });
}

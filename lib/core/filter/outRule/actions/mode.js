const { isString, typeError, validateSiblings, validateChild, getLatestFromNames } = require("../../util/ruleUtil");
const { PROPERTIES, MODE, STRING } = require("../../constant");

const depth = 1;
const config = {
	none: {
		siblings: [
			{ name: PROPERTIES },
		],
		children: { types: [STRING], match: "^(permissive|restrictive)$" },
	},
};

module.exports = {
	name: MODE,
	priority: 10,
	validate,
	execute,
	config,
};

function execute(parameters) {
	return new Promise(resolve => {
		parameters.data.mode = parameters.rule.current.value;
		resolve(true);
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, MODE);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isString(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: STRING });
}

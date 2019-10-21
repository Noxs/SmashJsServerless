const smash = require('../../../../../smash');
const errorUtil = smash.errorUtil();
const { isBoolean, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue } = require("../../util/ruleUtil");
const { CONTENT, DEFAULT, BOOLEAN, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, MIN, MAX, PROPERTIES, ERRORS, CLEAN } = require("../../constant");

const depth = 2;
const config = {
	none: {
		body: {
			siblings: [
				{ name: PROPERTIES },
				{ name: CLEAN },
			],
			children: { types: [BOOLEAN] },
		},
	},
	properties: {
		userInput: {
			siblings: [
				{ name: TYPE },
				{ name: CAST_TO },
				{ name: MATCH },
				{ name: VALIDATE },
				{ name: MIN },
				{ name: MAX },
				{ name: DEFAULT },
				{ name: PROPERTIES },
				{ name: CONTENT },
			],
			children: { types: [BOOLEAN] },
		},
	},
};

module.exports = {
	name: OPTIONAL,
	priority: 20,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		loadCurrentValue(data);
		if (rule.current.value === true && data.current.value === undefined) {
			resolve(false);
		} else if (data.current.value === undefined) {
			reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.MISSING, name: data.current.name }));
		} else {
			resolve(true);
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, OPTIONAL);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isBoolean(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: BOOLEAN });
}

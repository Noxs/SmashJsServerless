const smash = require('../../../../../smash');
const errorUtil = smash.errorUtil();
const { isString, typeError, readable, fullName, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue } = require("../../util/ruleUtil");
const { TRANSFORM, STRING, TYPE, CAST_TO, MATCH, DEFAULT, VALIDATE, MIN, MAX, ERRORS, OPTIONAL } = require("../../constant");

const depth = 1;
const config = {
	userInput: {
		siblings: [
			{ name: TYPE, match: "^(" + [STRING].join("|") + ")$" },
			{ name: CAST_TO },
			{ name: DEFAULT },
			{ name: VALIDATE },
			{ name: TRANSFORM },
			{ name: OPTIONAL },
			{ name: MIN },
			{ name: MAX },
		],
		children: { types: [STRING] },
	},
	content: {
		siblings: [
			{ name: TYPE, match: "^(" + [STRING].join("|") + ")$" },
			{ name: CAST_TO },
			{ name: DEFAULT },
			{ name: VALIDATE },
			{ name: TRANSFORM },
		],
		children: { types: [STRING] },
	},
};

module.exports = {
	name: MATCH,
	priority: 70,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		loadCurrentValue(data);
		const regexp = new RegExp(rule.current.value);
		if (regexp.test(data.current.value)) {
			resolve(true);
		} else {
			reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.MATCH, reason: ERRORS.REASON_MATCH, name: data.current.name, expected: rule.current.value, given: data.current.value }));
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, MATCH);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isString(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		try {
			new RegExp(child.value);
			return true;
		} catch (error) {
			throw new Error("Error in rule " + readable(ruleConfig) + " => '" + fullName(parents, current) + "': " + error.message);
		}
	}
	throw typeError({ current, ruleConfig, expected: STRING });
}

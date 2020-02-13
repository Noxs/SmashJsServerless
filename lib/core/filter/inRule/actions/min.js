const smash = require('../../../../../smash');
const errorUtil = smash.errorUtil();
const { isNumber, isArray, isObject, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, isString } = require("../../util/ruleUtil");
const { TRANSFORM, DEFAULT, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, MIN, MAX, PROPERTIES, ARRAY, OBJECT, NUMBER, INTEGER, UNSIGNED_INTEGER, STRING, ERRORS, CONTENT } = require("../../constant");

const depth = 2;
const config = {
	parameters: {
		userInput: {
			siblings: [
				{ name: TYPE, match: "^(" + [ARRAY, OBJECT, NUMBER, INTEGER, UNSIGNED_INTEGER, STRING].join("|") + ")$" },
				{ name: CAST_TO },
				{ name: MATCH },
				{ name: VALIDATE },
				{ name: MAX },
			],
			children: { types: [NUMBER] },
		},
	},
	properties: {
		userInput: {
			siblings: [
				{ name: OPTIONAL },
				{ name: TYPE, match: "^(" + [ARRAY, OBJECT, NUMBER, INTEGER, UNSIGNED_INTEGER, STRING].join("|") + ")$" },
				{ name: CAST_TO },
				{ name: MATCH },
				{ name: VALIDATE },
				{ name: TRANSFORM },
				{ name: MAX },
				{ name: DEFAULT },
				{ name: PROPERTIES },
				{ name: CONTENT },
			],
			children: { types: [NUMBER] },
		},
	},
};

module.exports = {
	name: MIN,
	priority: 70,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		loadCurrentValue(data);
		if (isNumber(data.current)) {
			if (rule.current.value > data.current.value) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, name: data.current.name, min: rule.current.value, given: data.current.value }));
			} else {
				resolve(true);
			}
		} else if (isArray(data.current)) {
			if (rule.current.value > data.current.value.length) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, name: data.current.name, min: rule.current.value, given: data.current.value.length }));
			} else {
				resolve(true);
			}
		} else if (isObject(data.current)) {
			if (rule.current.value > Object.keys(data.current.value).length) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, name: data.current.name, min: rule.current.value, given: Object.keys(data.current.value).length }));
			} else {
				resolve(true);
			}
		} else if (isString(data.current)) {
			if (rule.current.value > data.current.value.length) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, name: data.current.name, min: rule.current.value, given: data.current.value.length }));
			} else {
				resolve(true);
			}
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, MIN);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isNumber(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: NUMBER });
}


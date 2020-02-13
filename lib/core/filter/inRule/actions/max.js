const smash = require('../../../../../smash');
const errorUtil = smash.errorUtil();
const { isNumber, isObject, isArray, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, isString } = require("../../util/ruleUtil");
const { TRANSFORM, DEFAULT, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, MAX, MIN, PROPERTIES, ARRAY, OBJECT, NUMBER, INTEGER, UNSIGNED_INTEGER, STRING, ERRORS, CONTENT } = require("../../constant");

const depth = 2;
const config = {
	parameters: {
		userInput: {
			siblings: [
				{ name: TYPE, match: "^(" + [ARRAY, OBJECT, NUMBER, INTEGER, UNSIGNED_INTEGER, STRING].join("|") + ")$" },
				{ name: CAST_TO },
				{ name: MATCH },
				{ name: VALIDATE },
				{ name: MIN },
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
				{ name: MIN },
				{ name: DEFAULT },
				{ name: PROPERTIES },
				{ name: CONTENT },
			],
			children: { types: [NUMBER] },
		},
	},
};

module.exports = {
	name: MAX,
	priority: 70,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		loadCurrentValue(data);
		if (isNumber(data.current)) {
			if (data.current.value > rule.current.value) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, reason: ERRORS.REASON_RANGE, name: data.current.name, max: rule.current.value, given: data.current.value }));
			} else {
				resolve(true);
			}
		} else if (isArray(data.current)) {
			if (data.current.value.length > rule.current.value) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, reason: ERRORS.REASON_RANGE, name: data.current.name, max: rule.current.value, given: data.current.value.length }));
			} else {
				resolve(true);
			}
		} else if (isObject(data.current)) {
			if (Object.keys(data.current.value).length > rule.current.value) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, reason: ERRORS.REASON_RANGE, name: data.current.name, max: rule.current.value, given: Object.keys(data.current.value).length }));
			} else {
				resolve(true);
			}
		} else if (isString(data.current)) {
			if (data.current.value.length > rule.current.value) {
				reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.RANGE, reason: ERRORS.REASON_RANGE, name: data.current.name, max: rule.current.value, given: data.current.value.length }));
			} else {
				resolve(true);
			}
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, MAX);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isNumber(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: NUMBER });
}


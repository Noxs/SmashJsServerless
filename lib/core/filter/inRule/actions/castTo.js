const { isString, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, saveCurrentValue } = require("../../util/ruleUtil");
const { CAST_TO, STRING, TYPE, VALIDATE, MIN, MAX, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN, TRANSFORM } = require("../../constant");

const depth = 2;
const config = {
	properties: {
		userInput: {
			siblings: [
				{ name: TYPE, match: "^(" + [STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN].join("|") + ")$" },
				{ name: MIN },
				{ name: MAX },
				{ name: VALIDATE },
				{ name: TRANSFORM },
			],
			children: {
				types: [STRING],
				match: "^(" + [STRING, NUMBER, BOOLEAN].join("|") + ")$",
			},
		},
	},
};

module.exports = {
	name: CAST_TO,
	priority: 20,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise(resolve => {
		loadCurrentValue(data);
		if (rule.current.value === STRING) {
			data.current.value += "";
		} else if (rule.current.value === NUMBER) {
			data.current.value = Number(data.current.value);
		} else if (rule.current.value === BOOLEAN) {
			data.current.value = Boolean(data.current.value);
		}
		saveCurrentValue(data);
		resolve(true);
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, CAST_TO);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isString(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: STRING });
}


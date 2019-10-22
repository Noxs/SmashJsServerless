const { isBoolean, typeError, getSibling, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, saveCurrentValue } = require("../../util/ruleUtil");
const { CLEAN, BOOLEAN, PROPERTIES, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, MIN, MAX, DEFAULT, OBJECT } = require("../../constant");
const { extend } = require("../../../js/extend");

const depth = 2;
const config = {
	properties: {
		userInput: {
			siblings: [
				{ name: TYPE, match: "^(" + [OBJECT].join("|") + ")$" },
				{ name: CAST_TO },
				{ name: MATCH },
				{ name: VALIDATE },
				{ name: MIN },
				{ name: MAX },
				{ name: DEFAULT },
				{ name: PROPERTIES },
			],
			children: { types: [BOOLEAN] },
		},
	},
	none: {
		body: {
			siblings: [
				{ name: PROPERTIES },
				{ name: OPTIONAL },
			],
			children: { types: [BOOLEAN] },
		},
	},
};

module.exports = {
	name: CLEAN,
	priority: 100,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise(resolve => {
		loadCurrentValue(data);
		if (rule.current.value === true) {
			const properties = getSibling(rule.parents, PROPERTIES);
			const names = properties.map((userInput, key) => key);
			data.current.value = extend(data.current.value).pick(names);
		}
		saveCurrentValue(data);
		resolve(true);
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, CLEAN);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isBoolean(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: BOOLEAN });
}

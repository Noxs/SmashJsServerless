const { isFunction, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, getParentData, getInitialData, saveCurrentValue } = require("../../util/ruleUtil");
const { TRANSFORM, CONTENT, DEFAULT, FUNCTION, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, MIN, MAX, PROPERTIES, CLEAN } = require("../../constant");

const depth = 2;
const config = {
	properties: {
		userInput: {
			siblings: [
				{ name: OPTIONAL },
				{ name: TYPE },
				{ name: CAST_TO },
				{ name: MATCH },
				{ name: VALIDATE },
				{ name: MAX },
				{ name: MIN },
				{ name: DEFAULT },
				{ name: PROPERTIES },
				{ name: CONTENT },
			],
			children: { types: [FUNCTION] },
		},
	},
	none: {
		body: {
			siblings: [
				{ name: PROPERTIES },
				{ name: OPTIONAL },
				{ name: VALIDATE },
				{ name: CONTENT },
				{ name: DEFAULT },
				{ name: CLEAN },
				{ name: TYPE },
			],
			children: { types: [FUNCTION] },
		},
	},
};

module.exports = {
	name: TRANSFORM,
	priority: 40,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise(async (resolve, reject) => {
		loadCurrentValue(data);
		try {
			data.current.value = await rule.current.value(data.current, { parent: getParentData(data), initial: getInitialData(data) });
		} catch (error) {
			return reject(error);
		}
		saveCurrentValue(data);
		resolve(true);
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, TRANSFORM);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isFunction(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: FUNCTION });
}

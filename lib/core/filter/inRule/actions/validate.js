const { isFunction, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue } = require("../../util/ruleUtil");
const { CONTENT, DEFAULT, FUNCTION, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, MIN, MAX, PROPERTIES, CLEAN } = require("../../constant");

const depth = 2;
const config = {
	parameters: {
		userInput: {
			siblings: [
				{ name: TYPE },
				{ name: CAST_TO },
				{ name: MATCH },
				{ name: VALIDATE },
				{ name: PROPERTIES },
				{ name: MAX },
				{ name: MIN },
			],
			children: { types: [FUNCTION] },
		},
	},
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
				{ name: CLEAN },
			],
			children: { types: [FUNCTION] },
		},
	},
};

module.exports = {
	name: VALIDATE,
	priority: 60,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise(async (resolve, reject) => {
		loadCurrentValue(data);
		try {
			await rule.current.value(data.current.value);
			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, VALIDATE);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isFunction(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: FUNCTION });
}

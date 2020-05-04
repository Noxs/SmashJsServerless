const { isFunction, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, saveCurrentValue } = require("../../util/ruleUtil");
const { CLEAN, TRANSFORM, FUNCTION, DEFAULT, TYPE, STRING, PROPERTIES, OPTIONAL, CAST_TO, MATCH, VALIDATE, MIN, MAX, NUMBER, ARRAY, OBJECT, BOOLEAN } = require("../../constant");

const depth = 1;
const config = {
	body: {
		siblings: [
			{ name: PROPERTIES },
			{ name: OPTIONAL },
			{ name: VALIDATE },
			{ name: TRANSFORM },
			{ name: CLEAN },
		],
		children: { types: [BOOLEAN, STRING, NUMBER, FUNCTION, ARRAY, OBJECT] },
	},
	userInput: {
		siblings: [
			{ name: OPTIONAL },
			{ name: TYPE },
			{ name: CAST_TO },
			{ name: MATCH },
			{ name: VALIDATE },
			{ name: TRANSFORM },
			{ name: MIN },
			{ name: MAX },
			{ name: PROPERTIES },
		],
		children: { types: [BOOLEAN, STRING, NUMBER, FUNCTION, ARRAY, OBJECT] },
	},
};

module.exports = {
	name: DEFAULT,
	priority: 10,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise(async (resolve, reject) => {
		loadCurrentValue(data);
		if (data.current.value === undefined) {
			if (isFunction(rule.current)) {
				try {
					data.current.value = await rule.current.value(rule.current.value);
				} catch (error) {
					return reject(error);
				}
			} else {
				data.current.value = rule.current.value;
			}
		}
		saveCurrentValue(data);
		resolve(true);
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, DEFAULT);
	validateSiblings({ siblings, current, parents, ruleConfig });
	const child = current;
	validateChild({ child, children, parents, current, ruleConfig });
	return true;
}

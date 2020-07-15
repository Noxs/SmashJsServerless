const { isFunction, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, getInitialData, isArray } = require("../../util/ruleUtil");
const { PARAMETERS, BODY, PERMISSION, FUNCTION, ARRAY, FUNCTION_OR_ARRAY } = require("../../constant");

const depth = 1;
const config = {
	none: {
		siblings: [
			{ name: BODY },
			{ name: PARAMETERS },
		],
		children: { types: [FUNCTION, ARRAY] },
	},
};

module.exports = {
	name: PERMISSION,
	priority: 80,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise(async (resolve, reject) => {
		loadCurrentValue(data);
		try {
			if (isArray(rule.current)) {
				const initialData = getInitialData(data);
				await Promise.all(rule.current.value.map(functionToExecute => functionToExecute(initialData)));
			} else {
				await rule.current.value(getInitialData(data));
			}
			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, PERMISSION);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isFunction(current) || isArray(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: FUNCTION_OR_ARRAY });
}

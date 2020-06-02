const { isFunction, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, getParentData, getInitialData } = require("../../util/ruleUtil");
const { PARAMETERS, BODY, PERMISSION, FUNCTION } = require("../../constant");

const depth = 1;
const config = {
	none: {
		siblings: [
			{ name: BODY },
			{ name: PARAMETERS },
		],
		children: { types: [FUNCTION] },
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
			await rule.current.value(data.current, { parent: getParentData(data), initial: getInitialData(data) });
			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, PERMISSION);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isFunction(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: FUNCTION });
}

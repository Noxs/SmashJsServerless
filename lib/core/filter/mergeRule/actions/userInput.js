const { isObject, typeError, validateChild, getLatestFromNames, loadCurrentValue } = require("../../util/ruleUtil");
const { USER_INPUT, PROPERTIES, TYPE, INT, UINT, STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN } = require("../../constant");

const depth = 1;
const config = {
	properties: {
		siblings: [
			{ name: USER_INPUT },
		],
		children: [
			{ name: TYPE, match: "^(" + [STRING, NUMBER, INT, UINT, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN].join("|") + ")$" },
			{ name: PROPERTIES },
		],
	},
};

module.exports = {
	name: USER_INPUT,
	priority: 50,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	loadCurrentValue(data);
	const { processor, current, parents } = rule;
	current.value.forEach((value, name) => {
		const action = processor.getModuleByName(name);
		const result = action.execute({
			rule: {
				...rule,
				current: { name, value },
				parents: [...parents, current],
			},
			data,
		});
		if (result === false) {
			return false;
		}
	});
	return true;
}

function validate({ current, parents, rule, processor, ruleConfig }) {
	const { children } = getLatestFromNames(config, parents, depth, USER_INPUT);
	if (isObject(current)) {
		current.value.forEach((value, name) => {
			const child = { name, value };
			validateChild({ child, children, parents, current, ruleConfig });
			const newParents = [...parents, current];
			const newCurrent = { name, value, type: USER_INPUT };
			const action = processor.getModuleByName(name);
			action.validate({ current: newCurrent, parents: newParents, rule, processor, ruleConfig });
		});
		return true;
	}
	throw typeError({ current, ruleConfig, expected: OBJECT });
}

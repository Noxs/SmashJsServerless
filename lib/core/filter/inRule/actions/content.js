const { isObject, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue } = require("../../util/ruleUtil");
const Queue = require("../../util/queue");
const { CONTENT, PROPERTIES, OPTIONAL, USER_INPUT, OBJECT, TYPE, MATCH, VALIDATE, DEFAULT, MIN, MAX, BODY, ARRAY, PARAMETERS, CLEAN } = require("../../constant");
const { extend } = require("../../../js/extend");

const depth = 1;
const config = {
	userInput: {
		siblings: [
			{ name: TYPE, match: "^(" + [ARRAY].join("|") + ")$" },
			{ name: OPTIONAL },
			{ name: MATCH },
			{ name: VALIDATE },
			{ name: DEFAULT },
			{ name: MIN },
			{ name: MAX },
			{ name: CLEAN },
		],
		children: [
			{ name: TYPE },
			{ name: PROPERTIES },
			{ name: OPTIONAL },
			{ name: MATCH },
			{ name: VALIDATE },
			{ name: DEFAULT },
			{ name: MIN },
			{ name: MAX },
			{ name: CLEAN },
		],
	},
};

module.exports = {
	name: CONTENT,
	priority: 50,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		const { parents, processor } = rule;
		const { current } = data;
		const queue = new Queue();
		loadCurrentValue(data);
		extend(current.value);
		current.value.forEach((value, name) => {
			const nextCurrent = { name, value: rule.current.value, type: USER_INPUT };
			const action = processor.getModuleByName(nextCurrent.type ? nextCurrent.type : name);
			const currentData = { name, value };
			queue.add(action, {
				rule: {
					...rule,
					current: nextCurrent,
					parents: [...parents, current],
				},
				data: {
					...data,
					current: currentData,
					parents: [...data.parents, data.current],
				},
			});
		});
		queue.start().then(resolve).catch(reject);
	});
}

function validate({ current, parents, rule, processor, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, PROPERTIES);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isObject(current)) {
		extend(current.value);
		current.value.forEach((value, name) => {
			const child = { name, value, type: USER_INPUT };
			validateChild({ child, children, parents, current, ruleConfig });
			const newParents = [...parents, current];
			const newCurrent = { name, value };
			const action = processor.getModuleByName(newCurrent.type ? newCurrent.type : newCurrent.name, child.name);
			action.validate({ current: newCurrent, parents: newParents, rule, processor, ruleConfig });
		});
		return true;
	}
	throw typeError({ current, ruleConfig, expected: OBJECT });
}

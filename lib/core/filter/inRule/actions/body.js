const { isObject, typeError, validateSiblings, validateChild, getLatestFromNames, saveCurrentValue } = require("../../util/ruleUtil");
const Queue = require("../../util/queue");
const { BODY, PARAMETERS, PROPERTIES, OPTIONAL, OBJECT, CLEAN } = require("../../constant");

const depth = 1;
const config = {
	none: {
		siblings: [
			{ name: PARAMETERS },
		],
		children: [
			{ name: PROPERTIES, mandatory: true },
			{ name: OPTIONAL },
			{ name: CLEAN },
		],
	},
};


module.exports = {
	name: BODY,
	priority: 50,
	validate,
	execute,
	config,
};

function defaultProperties({ current, parents, rule }) {
	if (current.value.clean === undefined) {
		current.value.clean = true;
		saveCurrentValue({ current, parents, initialData: rule });
	}
}

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		const { current, parents, processor } = rule;
		const queue = new Queue();
		current.value.forEach((value, name) => {
			const action = processor.getModuleByName(name);
			queue.add(action, {
				rule: {
					...rule,
					current: { name, value },
					parents: [...parents, current],
				},
				data,
			});
		});
		queue.start().then(resolve).catch(reject);
	});
}

function validate({ current, parents, rule, processor, ruleConfig }) {
	defaultProperties({ current, parents, rule, processor, ruleConfig });
	const { siblings, children } = getLatestFromNames(config, parents, depth, BODY);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isObject(current)) {
		current.value.forEach((value, name) => {
			const child = { name, value };
			validateChild({ child, children, parents, current, ruleConfig });
			const newParents = [...parents, current];
			const newCurrent = { name, value };
			const action = processor.getModuleByName(name);
			action.validate({ current: newCurrent, parents: newParents, rule, processor, ruleConfig });
		});
		return true;
	}
	throw typeError({ current, ruleConfig, expected: OBJECT });
}

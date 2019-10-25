const smash = require('../../../../../smash');
const errorUtil = smash.errorUtil();
const { isObject, typeError, validateSiblings, validateChild, getLatestFromNames, typeOfValue } = require("../../util/ruleUtil");
const Queue = require("../../util/queue");
const { PARAMETERS, BODY, OBJECT, PROPERTIES, ERRORS } = require("../../constant");
const { extend } = require("../../../js/extend");

const depth = 1;
const config = {
	none: {
		siblings: [
			{ name: BODY },
		],
		children: [
			{ name: PROPERTIES, mandatory: true },
		],
	},
};

module.exports = {
	name: PARAMETERS,
	priority: 40,
	validate,
	execute,
	config,
};

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		const { current, parents, processor } = rule;
		if (data.current.value) {
			const queue = new Queue();
			extend(current.value).forEach((value, name) => {
				const action = processor.getModuleByName(name);
				queue.add(action, {
					rule: {
						...rule,
						current: { name, value },
						parents: [...parents, current],
					},
					data: {
						...data,
						parents: data.parents,
						current: data.current,
					},
				});
			});
			queue.start().then(resolve).catch(reject);
		} else {
			reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.TYPE, reason: ERRORS.REASON_TYPE, name: data.current.name, expected: rule.current.value, given: typeOfValue(data.current.value) }));
		}
	});
}

function validate({ current, parents, rule, processor, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, PARAMETERS);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isObject(current)) {
		extend(current.value).forEach((value, name) => {
			//this is only for parameters => because route params are static
			//TODO check if route.path  var exist if not throw and error
			// route params must exactly match rule userInput
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

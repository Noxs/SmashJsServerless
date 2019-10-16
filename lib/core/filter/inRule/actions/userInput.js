const { isObject, typeError, validateChild, getLatestFromNames } = require("../../util/ruleUtil");
const Queue = require("../../util/queue");
const { USER_INPUT, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, INT, UINT, DEFAULT, MIN, MAX, STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN, PROPERTIES } = require("../../constant");

const depth = 2;
const config = {
	parameters: {
		properties: {
			siblings: [
				{ name: USER_INPUT },
			],
			children: [
				{ name: TYPE, match: "^(" + [STRING, NUMBER, INT, UINT, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN].join("|") + ")$" },
				{ name: CAST_TO, match: "^(" + [STRING, NUMBER, BOOLEAN].join("|") + ")$" },
				{ name: MATCH, match: "^.*$" },
				{ name: VALIDATE },
				{ name: MIN },
				{ name: MAX },
				{ name: PROPERTIES },
			],
		},
	},
	body: {
		properties: {
			siblings: [
				{ name: USER_INPUT },
			],
			children: [
				{ name: TYPE, match: "^(" + [STRING, NUMBER, INT, UINT, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN].join("|") + ")$" },
				{ name: CAST_TO, match: "^(" + [STRING, NUMBER, BOOLEAN].join("|") + ")$" },
				{ name: MATCH, match: "^.*$" },
				{ name: VALIDATE },
				{ name: MIN },
				{ name: MAX },
				{ name: USER_INPUT },
				{ name: OPTIONAL },
				{ name: DEFAULT },
				{ name: PROPERTIES },
			],
		},
	},
	userInput: {
		properties: {
			siblings: [
				{ name: USER_INPUT },
			],
			children: [
				{ name: TYPE, match: "^(" + [STRING, NUMBER, INT, UINT, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN].join("|") + ")$" },
				{ name: CAST_TO, match: "^(" + [STRING, NUMBER, BOOLEAN].join("|") + ")$" },
				{ name: MATCH, match: "^.*$" },
				{ name: VALIDATE },
				{ name: DEFAULT },
				{ name: MIN },
				{ name: MAX },
				{ name: USER_INPUT },
				{ name: PROPERTIES },
				{ name: OPTIONAL },
			],
		},
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
	return new Promise((resolve, reject) => {
		const { processor, current, parents } = rule;
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
	const { children } = getLatestFromNames(config, parents, depth, USER_INPUT);
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

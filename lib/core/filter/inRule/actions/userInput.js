const { isObject, typeError, validateChild, getLatestFromNames, saveCurrentValue } = require("../../util/ruleUtil");
const Queue = require("../../util/queue");
const { CLEAN, TRANSFORM, CONTENT, USER_INPUT, OPTIONAL, TYPE, CAST_TO, MATCH, VALIDATE, INT, UINT, DEFAULT, MIN, MAX, STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN, PROPERTIES } = require("../../constant");
const { extend } = require("../../../js/extend");

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
				{ name: TRANSFORM },
				{ name: MIN },
				{ name: MAX },
				{ name: USER_INPUT },
				{ name: OPTIONAL },
				{ name: DEFAULT },
				{ name: PROPERTIES },
				{ name: CONTENT },
				{ name: CLEAN },
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
				{ name: TRANSFORM },
				{ name: DEFAULT },
				{ name: MIN },
				{ name: MAX },
				{ name: USER_INPUT },
				{ name: PROPERTIES },
				{ name: OPTIONAL },
				{ name: CONTENT },
				{ name: CLEAN },
			],
		},
	},
	content: {
		properties: {
			siblings: [
				{ name: USER_INPUT },
			],
			children: [
				{ name: TYPE, match: "^(" + [STRING, NUMBER, INT, UINT, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, BOOLEAN].join("|") + ")$" },
				{ name: CAST_TO, match: "^(" + [STRING, NUMBER, BOOLEAN].join("|") + ")$" },
				{ name: MATCH, match: "^.*$" },
				{ name: VALIDATE },
				{ name: TRANSFORM },
				{ name: DEFAULT },
				{ name: MIN },
				{ name: MAX },
				{ name: USER_INPUT },
				{ name: PROPERTIES },
				{ name: OPTIONAL },
				{ name: CONTENT },
				{ name: CLEAN },
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

function isCleanPossible({ current, parents, rule, processor, ruleConfig }) {
	try {
		if (isObject(current)) {
			const { children } = getLatestFromNames(config, parents, depth, PROPERTIES);
			extend(current.value).forEach((value, name) => {
				const child = { name, value, type: USER_INPUT };
				validateChild({ child, children, parents, current, ruleConfig });
				const newParents = [...parents, current];
				const newCurrent = { name, value };
				const action = processor.getModuleByName(newCurrent.type ? newCurrent.type : newCurrent.name, child.name);
				action.validate({ current: newCurrent, parents: newParents, rule, processor, ruleConfig });
			});
			return true;
		}
		return false;
	} catch (error) {
		return false;
	}
}

function defaultProperties({ current, parents, rule, processor, ruleConfig }) {
	if (current.value.clean === undefined) {
		current.value.clean = true;
		if (isCleanPossible({ current, parents, rule, processor, ruleConfig })) {
			saveCurrentValue({ current, parents, initialData: rule });
		} else {
			delete current.value.clean;
		}
	}
}

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		const { processor, current, parents } = rule;
		const queue = new Queue();
		extend(current.value).forEach((value, name) => {
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
	const { children } = getLatestFromNames(config, parents, depth, USER_INPUT);
	if (isObject(current)) {
		extend(current.value).forEach((value, name) => {
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

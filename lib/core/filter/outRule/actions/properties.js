const { isObject, isArray, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, saveCurrentValue, removeCurrentValue } = require("../../util/ruleUtil");
const Queue = require("../../util/queue");
const { PROPERTIES, USER_INPUT, OBJECT, TYPE, NONE, ARRAY, MODE, PERMISSIVE, RESTRICTIVE } = require("../../constant");

const depth = 1;
const config = {
	none: {
		siblings: [
			{ name: MODE },
		],
		children: [
			{ name: USER_INPUT },
		],
	},
	userInput: {
		siblings: [
			{ name: TYPE, match: "^(" + [OBJECT, ARRAY].join("|") + ")$" },
		],
		children: [
			{ name: USER_INPUT },
			{ name: TYPE },
		],
	},
	properties: {
		siblings: [
			{ name: TYPE, match: "^(" + [OBJECT, ARRAY].join("|") + ")$" },
		],
		children: [
			{ name: USER_INPUT },
			{ name: TYPE },
		],
	},
};

module.exports = {
	name: PROPERTIES,
	priority: 50,
	validate,
	execute,
	config,
};

function executePermissive({ rule, data }, { resolve }) {
	rule.current.value.forEach((value, name) => {
		const currentToRemove = { name };
		removeCurrentValue({ ...data, current: currentToRemove });
	});
	resolve(true);
}


function executeRestrictiveArray({ rule, data }, { resolve, reject }) {
	const { processor } = rule;
	const queue = new Queue();
	rule.current.value.forEach((value, name) => {
		const action = processor.getModuleByName(name);
		data.current.value.forEach((dataValue, dataName) => {
			queue.add(action, {
				rule: { ...rule, current: { name, value }, parents: [...rule.parents, rule.current] },
				data: { ...data, current: { name: dataName, value: dataValue }, parents: [...data.parents, data.current] },
			});
		});
	});
	queue.start().then(() => {
		const newArray = [];
		for (let i = 0; i < data.current.value.length; i++) {
			if (data.current.value[i] !== undefined) {
				newArray.push(data.current.value[i]);
			}
		}
		data.current.value = newArray;
		saveCurrentValue(data);
		resolve(true);
	}).catch(reject);
}


function executeRestrictive({ rule, data }, { resolve, reject }) {
	const { processor } = rule;
	const queue = new Queue();
	data.current.value.forEach((value, name) => {
		const nextRuleKey = rule.current.value.find((userInput, userInputKey) => userInputKey === name);
		if (nextRuleKey) {
			const nextCurrent = { name, value: rule.current.value[nextRuleKey] };
			if (rule.parents.last().name === NONE || rule.parents.last().name === PROPERTIES || rule.parents.last().type) {
				nextCurrent.type = USER_INPUT;
			}
			const action = processor.getModuleByName(nextCurrent.type ? nextCurrent.type : name);
			const currentData = { name, value: data.current.value[name] };
			queue.add(action, { rule: { ...rule, current: nextCurrent, parents: [...rule.parents, rule.current] }, data: { ...data, current: currentData } });
		} else {
			const currentToRemove = { name };
			const dataToRemove = { ...data, current: currentToRemove };
			if (rule.parents.last().type === USER_INPUT) {
				dataToRemove.parents = [...dataToRemove.parents, data.current];
			}
			removeCurrentValue(dataToRemove);
		}
	});
	queue.start().then(resolve).catch(reject);
}

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		if (!data.mode) {
			data.mode = RESTRICTIVE;
		}
		loadCurrentValue(data);
		if (data.mode === PERMISSIVE) {
			executePermissive({ rule, data }, { resolve, reject });
		} else if (data.mode === RESTRICTIVE) {
			if (isArray(data.current)) {
				executeRestrictiveArray({ rule, data }, { resolve, reject });
			} else {
				executeRestrictive({ rule, data }, { resolve, reject });
			}
		}
	});
}

function validate({ current, parents, rule, processor, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, PROPERTIES);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isObject(current)) {
		current.value.forEach((value, name) => {
			const child = { name, value, type: USER_INPUT };
			if (parents.last().value.type === ARRAY) {
				delete child.type;
			}
			validateChild({ child, children, parents, current, ruleConfig });
			const newParents = [...parents, current];
			const newCurrent = { name, value };
			if (child.type) {
				newCurrent.type = child.type;
			}
			const action = processor.getModuleByName(newCurrent.type ? newCurrent.type : newCurrent.name, child.name);
			action.validate({ current: newCurrent, parents: newParents, rule, processor, ruleConfig });
		});
		return true;
	}
	throw typeError({ current, ruleConfig, expected: OBJECT });
}

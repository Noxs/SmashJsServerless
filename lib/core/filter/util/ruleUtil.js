const SmashError = require("../../../../lib/util/smashError");
const { extend } = require("../../js/extend");
const { BOOLEAN, NUMBER, STRING, FUNCTION, OBJECT, NONE, SKIP, ARRAY } = require("../constant");
const errorUtil = new SmashError();

module.exports = {
	readable,
	isObject,
	isArray,
	isBoolean,
	isFunction,
	isNumber,
	isString,
	isRegexp,
	isSameType,
	unexpectedError,
	typeError,
	valueError,
	fullName,
	getLatestFromNames,
	loadCurrentValue,
	saveCurrentValue,
	removeCurrentValue,
	match,
	toString,
	getSibling,
	validateSiblings,
	validateChild,
	getParentData,
	getInitialData,
};

function readable(object) {
	return Object.keys(extend(object)).sort().map(key => key + ": " + (typeof object[key] === "object" ? "object" : object[key])).join(", ");
}

function isObject({ value }) {
	return typeof value === OBJECT;
}

function isBoolean({ value }) {
	return typeof value === BOOLEAN;
}

function isFunction({ value }) {
	return typeof value === FUNCTION;
}

function isNumber({ value }) {
	return typeof value === NUMBER;
}

function isString({ value }) {
	return typeof value === STRING;
}

function isRegexp({ value }) {
	return value instanceof RegExp;
}

function isSameType({ value }, type) {
	if (isArray({ value }) && type === ARRAY) {
		return true;
	}
	return typeof value === type || value.constructor === type;
}

function isArray({ value }) {
	return Array.isArray(value);
}

function toString(item) {
	if (item.toString) {
		return item.toString();
	}
	return item;
}

function unexpectedError({ current, ruleConfig, parents }) {
	return new Error("Error in rule " + readable(ruleConfig) + " in " + parents.join(".") + " => " + readable(current));
}

function typeError({ current, ruleConfig, expected }) {
	return new errorUtil.TypeError("Error in rule " + readable(ruleConfig) + " => '" + current.name + "' expected type to be '" + toString(expected) + "', ", current.value);
}

function valueError({ current, ruleConfig, expected }) {
	return new errorUtil.ValueError("Error in rule " + readable(ruleConfig) + " => '" + current.name + "' expected value to be '" + toString(expected) + "', ", current.value);
}

function fullName(parents, { name }) {
	const lastProperty = name;
	const parentsName = parents.map(({ name }) => name).filter(name => name !== NONE);
	return parentsName.join(".") + (parentsName.length ? "." : "") + lastProperty;
}

function getLatestFromNames(config, parents, depth, name) {
	const keys = parents.map(({ name, type }) => type ? type : name).reverse();
	const filteredKeys = [];
	for (let i = 0; i < depth; i++) {
		if (keys[i] === undefined && config[SKIP]) {
			filteredKeys.unshift(SKIP);
		} else {
			filteredKeys.unshift(keys[i]);
		}
	}
	let value = config;
	const usedKey = [];
	filteredKeys.forEach(key => {
		if (value[key]) {
			usedKey.push(key);
			value = value[key];
		} else {
			throw new Error("Invalid configuration for '" + name + "' action: search for '" + key + "' in " + (usedKey.length ? usedKey.join(".") : "root"));
		}
	});
	return value;
}

function loadCurrentValue({ current, parents, initialData }) {
	let data = initialData;
	if (parents.length > 1) {
		const keys = parents.slice(1).map(({ name }) => name);
		keys.forEach(key => {
			data = data[key];
		});
	}
	if (current.name === NONE) {
		current.value = extend(data);
	} else {
		current.value = extend(data[current.name]);
	}
	return current;
}

function saveCurrentValue({ current, parents, initialData }) {
	let data = initialData;
	if (parents.length > 1) {
		const keys = parents.slice(1).map(({ name }) => name);
		keys.forEach(key => {
			data = data[key];
		});
	}
	if (current.name === NONE) {
		data = current.value;
	} else {
		data[current.name] = current.value;
	}
	return current;
}

function removeCurrentValue({ current, parents, initialData }) {
	let data = initialData;
	if (parents.length > 1) {
		const keys = parents.slice(1).map(({ name }) => name);
		keys.forEach(key => {
			data = data[key];
		});
	}
	delete data[current.name];
	return current;
}

function match(finded, itemToTest, ruleConfig) {
	if (finded.match) {
		const regexp = new RegExp(finded.match);
		if (!regexp.test(itemToTest.value)) {
			throw valueError({ current: itemToTest, ruleConfig, expected: finded.match });
		}
	}
	return true;
}

function getSibling(parents, property) {
	return extend(extend(parents).last().value[property]);
}

//TODO add 'mandatory' support
function validateSiblings({ current, parents, siblings, ruleConfig }) {
	Object.keys(extend(parents).last().value).filter(name => current.name !== name).forEach(name => {
		const finded = siblings.find(sibling => sibling.name === name || name === current.name);
		if (!finded) {
			throw new Error("Error in rule " + readable(ruleConfig) + " => '" + name + "' is not authorized to be at the same level as " + fullName(parents, current));
		}
		if (name !== current.name) {
			match(finded, { name, value: parents.last().value[name] }, ruleConfig);
		}
	});
	return true;
}

//TODO add 'mandatory' support
function validateChild({ child, parents, current, children, ruleConfig }) {
	if (isArray({ value: children })) {
		const finded = children.find(type => type.name === child.name || (child.type && type.name === child.type));
		if (!finded) {
			throw new Error("Error in rule " + readable(ruleConfig) + " => '" + child.name + "' is not authorized to be under " + fullName(parents, current));
		}
		match(finded, child, ruleConfig);
	} else {
		if (!children.types.some(type => isSameType(child, type))) {
			throw typeError({ current, ruleConfig, expected: children.types.join(", ") });
		}
		match(children, child, ruleConfig);
	}
	return true;
}

function getParentData({ parents }) {
	return extend(parents).last();
}

function getInitialData({ initialData }) {
	return initialData;
}

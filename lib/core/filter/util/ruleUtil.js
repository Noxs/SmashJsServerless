const SmashError = require("../../../../lib/util/smashError");
const { extend } = require("../../js/extend");
const { BOOLEAN, NUMBER, STRING, FUNCTION, OBJECT, NONE } = require("../constant");
const errorUtil = new SmashError();

module.exports = {
	readable,
	isObject,
	isArray,
	isBoolean,
	isFunction,
	isNumber,
	isString,
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
	getSibling,
	validateSiblings,
	validateChild,
};

function readable(object) {
	extend(object);
	return Object.keys(object).sort().map(key => key + ": " + (typeof object[key] === "object" ? "object" : object[key])).join(", ");
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

function isSameType({ value }, type) {
	return typeof value === type;
}

function isArray({ value }) {
	return Array.isArray(value);
}

function unexpectedError({ current, ruleConfig, parents }) {
	return new Error("Error in rule " + readable(ruleConfig) + " in " + parents.join(".") + " => " + readable(current));
}

function typeError({ current, ruleConfig, expected }) {
	return new errorUtil.TypeError("Error in rule " + readable(ruleConfig) + " => '" + current.name + "' expected type to be '" + expected + "', ", current.value);
}

function valueError({ current, ruleConfig, expected }) {
	return new errorUtil.ValueError("Error in rule " + readable(ruleConfig) + " => '" + current.name + "' expected value to be '" + expected + "', ", current.value);
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
		filteredKeys.unshift(keys[i]);
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
		current.value = data;
	} else {
		current.value = data[current.name];
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
	extend(parents);
	return parents.last().value[property];
}

//TODO add 'mandatory' support
function validateSiblings({ current, parents, siblings, ruleConfig }) {
	extend(parents);
	Object.keys(parents.last().value).filter(name => current.name !== name).forEach(name => {
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

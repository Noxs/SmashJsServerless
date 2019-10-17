module.exports = {
	validate,
	identify,
	execute,
};

const types = [
	{ name: "processName", structure: [{ name: "name" }], next: () => null, child: null, execute: processName },
	{ name: "processObject", structure: [{ name: "type", match: "^object$" }, { name: "properties" }], next: current => current.properties ? current.properties : null, child: "properties", execute: processObject },
	{ name: "processArray", structure: [{ name: "type", match: "^array$" }, { name: "content" }], next: current => current.content ? [current.content] : null, child: "content", execute: processArray },
	{ name: "processNamedObject", structure: [{ name: "name" }, { name: "type", match: "^object$" }, { name: "properties" }], next: current => current.properties ? current.properties : null, child: "properties", execute: processNamedObject },
	{ name: "processNamedArray", structure: [{ name: "name" }, { name: "type", match: "^array$" }, { name: "content" }], next: current => current.content ? [current.content] : null, child: "content", execute: processNamedArray },
];


function readable(object) {
	return Object.keys(object).sort().map(key => key + ": " + (typeof object[key] === "object" ? "object" : object[key])).join(", ");
}

function unexpectedError({ current, ruleConfig, parents }) {
	return new Error("Error in rule " + readable(ruleConfig) + " in " + parents.join(".") + " => " + readable(current));
}

function match(current, type) {
	return type.structure.every(({ name, match }) => {
		if (name === "type") {
			const regexp = new RegExp(match);
			return regexp.test(current[name]);
		}
		if (name === "properties") {
			return Array.isArray(current[name]);
		}
		if (name === "content") {
			return (typeof current[name] === "object" && !Array.isArray(current[name]));
		}
		return true;
	});
}

function identify({ current, ruleConfig, parents }) {
	const currentKeys = Object.keys(current);
	const type = types.find(type => {
		const names = type.structure.map(item => item.name);
		if (currentKeys.equals(names)) {
			return match(current, type);
		}
		return false;
	});
	if (type === undefined) {
		throw unexpectedError({ current, ruleConfig, parents });
	}
	return type;
}

function recursiveVerify({ current, ruleConfig, parents }) {
	let next = current;
	while (next) {
		const type = identify({ current: next, ruleConfig, parents });
		next = type.next(next);
		if (next) {
			for (const item of next) {
				if (Object.keys(item).length === 0) {
					throw unexpectedError({ current, ruleConfig, parents: [...parents, type.child] });
				}
				recursiveVerify({
					current: item,
					ruleConfig,
					parents: [...parents, type.child],
				});
			}
			next = null;
		}
	}
	return true;
}

function validate({ current, ruleConfig }) {
	const parents = [];
	if (!current) {
		throw unexpectedError({ current, ruleConfig, parents });
	}
	return recursiveVerify({ current, ruleConfig, parents });
}

function processName({ data }) {
	return data.current;
}

function processObject({ rule, data }) {
	if (typeof data.current === "object" && Array.isArray(data.current) === false) {
		const properties = rule.current.properties;
		data.current.forEach((value, key) => {
			const finded = properties.find(property => property.name === key);
			if (finded) {
				data.current = recursiveExecute({ rule: { ...rule, current: finded }, data: { ...data, current: data.current } });
			} else {
				delete data.current[key];
			}
		});
	} else {
		data.current = {};
	}
	return data.current;
}

function processArray({ rule, data }) {
	if (Array.isArray(data.current)) {
		data.current.forEach((value, key) => {
			data.current[key] = recursiveExecute({ rule: { ...rule, current: rule.current.content }, data: { ...data, current: value } });
		});
	} else {
		data.current = [];
	}
	return data.current;
}

function processNamedObject({ rule, data }) {
	if (typeof data.current[rule.current.name] === 'object' && Array.isArray(typeof data.current[rule.current.name]) === false) {
		const properties = rule.current.properties;
		data.current[rule.current.name].forEach((value, key) => {
			const finded = properties.find(property => property.name === key);
			if (finded) {
				data.current[rule.current.name][key] = recursiveExecute({ rule: { ...rule, current: finded }, data: { ...data, current: value } });
			} else {
				delete data.current[rule.current.name][key];
			}
		});
	} else {
		delete data.current[rule.current.name];
	}
	return data.current;
}

function processNamedArray({ rule, data }) {
	if (Array.isArray(data.current[rule.current.name])) {
		data.current[rule.current.name].forEach((value, key) => {
			data.current[rule.current.name][key] = recursiveExecute({ rule: { ...rule, current: rule.current.content }, data: { ...data, current: value } });
		});
	} else {
		delete data.current[rule.current.name];
	}
	return data.current;
}


function recursiveExecute({ rule, data }) {
	const type = identify({ current: rule.current, ruleConfig: rule.ruleConfig });
	return type.execute({ rule, data });
}

function execute({ rule, data }) {
	return recursiveExecute({ rule, data });
}


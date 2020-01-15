const { extend } = require("../../../js/extend");

const type = {
	name: "object",
	structure: [
		{ name: "type", match: "^object$" },
		{ name: "properties" },
		{ name: "transform", optional: true },
	],
	child: "properties",
	identify,
	validate,
	next,
	execute,
};

module.exports = type;

const cases = {
	case1: ({ current }) => current.properties && current.type && Object.keys(current).length === 2 && Array.isArray(current.properties) && new RegExp(type.structure[0].match).test(current.type),
	case2: ({ current }) => current.properties && current.type && Object.keys(current).length === 3 && Array.isArray(current.properties) && new RegExp(type.structure[0].match).test(current.type) && typeof current.transform === 'function',
};

function identify({ current }) {
	if (cases.case1({ current }) || cases.case2({ current })) {
		return true;
	}
	return false;
}

function validate({ current, ruleConfig, parents, processor }) {
	current.properties.forEach(property => {
		const type = processor.identify({ current: property, ruleConfig, parents });
		type.validate({ current: property, ruleConfig, parents: [...parents, type.child], processor });
	});
	return true;
}

function next(current) {
	return current.properties ? current.properties : null;
}

function execute({ rule, data, processor }) {
	return new Promise(async (resolve, reject) => {
		try {
			if (typeof data.current === "object" && data.current !== null && Array.isArray(data.current) === false) {
				const properties = rule.current.properties;
				if (rule.current.transform) {
					data.current = await rule.current.transform(data.current);
				}
				extend(data.current);
				await data.current.forEach(async (value, key) => {
					const finded = properties.find(property => property.name === key);
					if (finded) {
						data.current = await processor.executeNext({ rule: { ...rule, current: finded }, data: { ...data, current: data.current } });
					} else {
						delete data.current[key];
					}
				});
			} else {
				delete data.current;
			}
			resolve(data.current);
		} catch (error) {
			reject(error);
		}
	});
}

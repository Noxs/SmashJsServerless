const { extend } = require("../../../js/extend");

const type = {
	name: "object",
	structure: [
		{ name: "type", match: "^object$" },
		{ name: "properties" },
	],
	child: "properties",
	identify,
	validate,
	next,
	execute,
};

module.exports = type;

function identify({ current }) {
	const regexp = new RegExp("^object$");
	if (current.properties &&
		current.type &&
		Object.keys(current).length === 2 &&
		Array.isArray(current.properties) &&
		regexp.test(current.type)) {
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
			if (typeof data.current === "object" && Array.isArray(data.current) === false) {
				const properties = rule.current.properties;
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
				data.current = {};
			}
			resolve(data.current);
		} catch (error) {
			reject(error);
		}
	});
}

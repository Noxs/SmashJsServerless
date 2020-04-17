const type = {
	name: "namedObject",
	structure: [
		{ name: "name" },
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
	case1: ({ current }) => current.properties && current.type && Object.keys(current).length === 3 && Array.isArray(current.properties) && new RegExp(type.structure[1].match).test(current.type),
	case2: ({ current }) => current.properties && current.type && Object.keys(current).length === 4 && Array.isArray(current.properties) && new RegExp(type.structure[1].match).test(current.type) && typeof current.transform === 'function',
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
			if (typeof data.current[rule.current.name] === 'object' && data.current[rule.current.name] !== null && Array.isArray(data.current[rule.current.name]) === false) {
				const properties = rule.current.properties;
				if (rule.current.transform) {
					data.current[rule.current.name] = await rule.current.transform(data.current[rule.current.name], data.current);
				}
				const keys = Object.keys(data.current[rule.current.name]);
				for (const key of keys) {
					const finded = properties.find(property => property.name === key);
					if (finded) {
						data.current[rule.current.name] = await processor.executeNext({ rule: { ...rule, current: finded }, data: { ...data, current: data.current[rule.current.name] } });// eslint-disable-line no-await-in-loop
					} else {
						delete data.current[rule.current.name][key];
					}
				}
			} else {
				delete data.current[rule.current.name];
			}
			resolve(data.current);
		} catch (error) {
			reject(error);
		}
	});
}

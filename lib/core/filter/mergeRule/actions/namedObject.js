const type = {
	name: "namedObject",
	structure: [
		{ name: "name" },
		{ name: "type", match: "^object$" },
		{ name: "properties" },
		{ name: "mode", match: "^(restrictive|permissive)$", optional: true },
	],
	child: "properties",
	identify,
	validate,
	next,
	execute,
};

module.exports = type;

const regexpType = new RegExp("^object$");
const regexpMode = new RegExp("^(restrictive|permissive)$");
const cases = {
	case1: ({ current }) => current.name && current.properties && current.type && Object.keys(current).length === 3 && Array.isArray(current.properties) && regexpType.test(current.type),
	case2: ({ current }) => current.name && current.properties && current.type && Object.keys(current).length === 4 && Array.isArray(current.properties) && regexpType.test(current.type) && current.mode && regexpMode.test(current.mode),
};

function identify({ current }) {
	if (cases.case1({ current })) {
		current.mode = "restrictive";
		return true;
	}
	if (cases.case2({ current })) {
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

function execute({ target, source, rule, processor }) {
	return new Promise(async (resolve, reject) => {
		try {
			if (typeof source.current[rule.current.name] === 'object' && Array.isArray(source.current[rule.current.name]) === false) {
				const properties = rule.current.properties;
				await source.current[rule.current.name].forEach(async (value, key) => {
					const finded = properties.find(property => property.name === key);
					if (finded) {
						target.current[rule.current.name] = await processor.executeNext({
							rule: { ...rule, current: finded },
							source: { ...source, current: source.current[rule.current.name] },
							target: { ...target, current: target.current[rule.current.name] },
						});
					}
				});
			}
			resolve(target.current);
		} catch (error) {
			reject(error);
		}
	});
}

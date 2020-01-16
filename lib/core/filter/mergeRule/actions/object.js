const { extend } = require("../../../js/extend");

const type = {
	name: "object",
	structure: [
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
	case1: ({ current }) => current.properties && current.type && Object.keys(current).length === 2 && Array.isArray(current.properties) && regexpType.test(current.type),
	case2: ({ current }) => current.properties && current.type && Object.keys(current).length === 3 && Array.isArray(current.properties) && regexpType.test(current.type) && current.mode && regexpMode.test(current.mode),
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
			if (!target.current) {
				target.current = {};
			}
			if (typeof source.current === "object" && Array.isArray(source.current) === false) {
				const properties = rule.current.properties;
				const keys = Object.keys(source.current);
				for (const key of keys) {
					const finded = properties.find(property => property.name === key);
					if (finded) {
						target.current = await processor.executeNext({
							rule: { ...rule, current: finded },
							source: { ...source, current: source.current },
							target: { ...target, current: target.current },
						});
					}
				}
			}
			resolve(target.current);
		} catch (error) {
			reject(error);
		}
	});
}

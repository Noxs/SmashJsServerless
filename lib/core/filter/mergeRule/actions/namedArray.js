const type = {
	name: "namedArray",
	structure: [
		{ name: "name" },
		{ name: "type", match: "^array$" },
		{ name: "content" },
	],
	child: "content",
	identify,
	validate,
	next,
	execute,
};

module.exports = type;

function identify({ current }) {
	const regexp = new RegExp("^array$");
	if (current.name &&
		current.content &&
		current.type &&
		Object.keys(current).length === 3 &&
		Array.isArray(current.content) === false &&
		typeof current.content === "object" &&
		regexp.test(current.type)) {
		return true;
	}
	return false;
}

function validate({ current, ruleConfig, parents, processor }) {
	const type = processor.identify({ current: current.content, ruleConfig, parents });
	type.validate({ current: current.content, ruleConfig, parents: [...parents, type.child], processor });
	return true;
}

function next(current) {
	return current.content ? current.content : null;
}

function execute({ target, source, rule, processor }) {
	return new Promise(async (resolve, reject) => {
		try {
			if (Array.isArray(source.current[rule.current.name])) {
				await source.current[rule.current.name].forEach(async (value, key) => {
					target.current[rule.current.name][key] = await processor.executeNext({
						rule: { ...rule, current: rule.current.content },
						source: { ...source, current: value },
						target: { ...target, current: target.current[rule.current.name][key] },
					});
				});
			}
			resolve(target.current);
		} catch (error) {
			reject(error);
		}
	});
}

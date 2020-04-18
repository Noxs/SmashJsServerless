const type = {
	name: "array",
	structure: [
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
	if (current.content &&
		current.type &&
		Object.keys(current).length === 2 &&
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
			if (Array.isArray(source.current)) {
				for (const key in source.current) {
					const value = source.current[key];
					target.current[key] = await processor.executeNext({ // eslint-disable-line no-await-in-loop
						rule: { ...rule, current: rule.current.content },
						source: { ...source, current: value },
						target: { ...target, current: target.current[key] },
					});
				}
			}
			resolve(target.current);
		} catch (error) {
			reject(error);
		}
	});
}

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

function execute({ rule, data, processor }) {
	return new Promise(async (resolve, reject) => {
		try {
			if (Array.isArray(data.current)) {
				await Promise.all(data.current.map((value, key) => { // eslint-disable-line arrow-body-style
					return new Promise(async (resolve, reject) => {
						try {
							data.current[key] = await processor.executeNext({ rule: { ...rule, current: rule.current.content }, data: { ...data, current: value } });
							resolve();
						} catch (error) {
							reject(error);
						}
					});
				}));
				data.current = data.current.filter(item => item !== null && item !== undefined);
			} else {
				data.current = [];
			}
			resolve(data.current);
		} catch (error) {
			reject(error);
		}
	});
}

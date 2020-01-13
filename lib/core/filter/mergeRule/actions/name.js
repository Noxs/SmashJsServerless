const type = {
	name: "name",
	structure: [
		{ name: "name" },
		{ name: "beforeMerge", optional: true },
	],
	child: null,
	identify,
	validate,
	next,
	execute,
};

module.exports = type;

const cases = {
	case1: ({ current }) => current.name && Object.keys(current).length === 1,
	case2: ({ current }) => current.name && current.beforeMerge && Object.keys(current).length === 2 && typeof current.beforeMerge === 'function',
};

function identify({ current }) {
	if (cases.case1({ current }) || cases.case2({ current })) {
		return true;
	}
	return false;
}

function validate() {
	return true;
}

function next() {
	return null;
}

function execute({ target, source, rule }) {
	return new Promise(async (resolve, reject) => {
		try {
			if (rule.current.beforeMerge) {
				source.current[rule.current.name] = await rule.current.beforeMerge(source.current[rule.current.name], source.current);
			}
			if (source.current[rule.current.name] !== undefined) {
				target.current[rule.current.name] = source.current[rule.current.name];
			}
			resolve(target.current);
		} catch (error) {
			reject(error);
		}
	});
}


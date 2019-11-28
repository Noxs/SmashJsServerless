const type = {
	name: "name",
	structure: [
		{ name: "name" },
		{ name: "transform", optional: true },
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
	case2: ({ current }) => current.name && current.transform && Object.keys(current).length === 2 && typeof current.transform === 'function',
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

function execute({ rule, data }) {
	return new Promise(async (resolve, reject) => {
		try {
			if (rule.current.transform) {
				data.current[rule.current.name] = await rule.current.transform(data.current[rule.current.name]);
			}
			resolve(data.current);
		} catch (error) {
			reject(error);
		}
	});
}


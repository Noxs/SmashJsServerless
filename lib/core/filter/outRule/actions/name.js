const type = {
	name: "name",
	structure: [
		{ name: "name" },
	],
	child: null,
	identify,
	validate,
	next,
	execute,
};

module.exports = type;

function identify({ current }) {
	if (current.name && Object.keys(current).length === 1) {
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

function execute({ data }) {
	return new Promise(resolve => {
		resolve(data.current);
	});
}


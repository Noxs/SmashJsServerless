const { MODE, PROPERTIES, STRING } = require("../../constant");

module.exports = {
	name: MODE,
	priority: 10,
	execute,
	validate,
	config: {
		siblings: [
			{ name: PROPERTIES },
		],
		children: { types: [STRING] },
	},
};

function execute(/* TODO parameters*/) {
	return new Promise((resolve, reject) => {
		//TODO
		resolve();
	});
}

function validate({ current, rule }) {
	return true;
	return false;
}

const { BEFORE_MERGE, TYPE, FUNCTION, CAST_TO } = require("../../constant");

module.exports = {
	name: BEFORE_MERGE,
	priority: 20,
	execute,
	validate,
	config: {
		siblings: [
			{ name: TYPE },
			{ name: CAST_TO },
		],
		children: { types: [FUNCTION] },
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

const { isString, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue, removeCurrentValue } = require("../../util/ruleUtil");
const { TYPE, STRING, PROPERTIES, NUMBER, INTEGER, UNSIGNED_INTEGER, INT, UINT, ARRAY, OBJECT, BOOLEAN } = require("../../constant");

const depth = 1;
const config = {
	userInput: {
		siblings: [
			{ name: PROPERTIES },
		],
		children: {
			types: [STRING],
			match: "^(" + [STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, INT, UINT, BOOLEAN].join("|") + ")$",
		},
	},

};

const TYPES = {
	"unsigned integer": value => Number.isInteger(value) === true && value >= 0,
	uint: value => Number.isInteger(value) === true && value >= 0,
	integer: Number.isInteger,
	int: Number.isInteger,
	number: value => typeof value === NUMBER,
	string: value => typeof value === STRING,
	boolean: value => typeof value === BOOLEAN,
	array: value => Array.isArray(value),
	object: value => typeof value === OBJECT && Array.isArray(value) === false,
};

module.exports = {
	name: TYPE,
	priority: 40,
	validate,
	execute,
	config,
	TYPES,
};

function execute({ rule, data }) {
	return new Promise(resolve => {
		loadCurrentValue(data);
		if (TYPES[rule.current.value](data.current.value) === false) {
			removeCurrentValue(data);
			resolve(false);
		} else {
			resolve(true);
		}
	});
}

function validate({ current, parents, ruleConfig }) {
	const { siblings, children } = getLatestFromNames(config, parents, depth, TYPE);
	validateSiblings({ siblings, current, parents, ruleConfig });
	if (isString(current)) {
		const child = current;
		validateChild({ child, children, parents, current, ruleConfig });
		return true;
	}
	throw typeError({ current, ruleConfig, expected: STRING });
}

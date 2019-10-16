const smash = require('../../../../../smash');
const errorUtil = smash.errorUtil();
const { isString, typeError, validateSiblings, validateChild, getLatestFromNames, loadCurrentValue } = require("../../util/ruleUtil");
const { TYPE, STRING, PROPERTIES, OPTIONAL, CAST_TO, MATCH, VALIDATE, DEFAULT, MIN, MAX, NUMBER, INTEGER, UNSIGNED_INTEGER, INT, UINT, ARRAY, OBJECT, BOOLEAN, ERRORS, UNKNOWN } = require("../../constant");

const depth = 3;
const config = {
	parameters: {
		properties: {
			userInput: {
				siblings: [
					{ name: CAST_TO },
					{ name: MATCH },
					{ name: VALIDATE },
					{ name: MIN },
					{ name: MAX },
					{ name: PROPERTIES },
				],
				children: {
					types: [STRING],
					match: "^(" + [STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, INT, UINT, BOOLEAN].join("|") + ")$",
				},
			},
		},
	},
	body: {
		properties: {
			userInput: {
				siblings: [
					{ name: OPTIONAL },
					{ name: CAST_TO },
					{ name: MATCH },
					{ name: VALIDATE },
					{ name: DEFAULT },
					{ name: MIN },
					{ name: MAX },
					{ name: PROPERTIES },
				],
				children: {
					types: [STRING],
					match: "^(" + [STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, INT, UINT, BOOLEAN].join("|") + ")$",
				},
			},
		},
	},
	properties: {
		userInput: {
			properties: {
				siblings: [
					{ name: OPTIONAL },
					{ name: CAST_TO },
					{ name: MATCH },
					{ name: VALIDATE },
					{ name: DEFAULT },
					{ name: MIN },
					{ name: MAX },
					{ name: PROPERTIES },
				],
				children: {
					types: [STRING],
					match: "^(" + [STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, INT, UINT, BOOLEAN].join("|") + ")$",
				},
			},
		},
	},
	userInput: {
		properties: {
			userInput: {
				siblings: [
					{ name: OPTIONAL },
					{ name: CAST_TO },
					{ name: MATCH },
					{ name: VALIDATE },
					{ name: DEFAULT },
					{ name: MIN },
					{ name: MAX },
					{ name: PROPERTIES },
				],
				children: {
					types: [STRING],
					match: "^(" + [STRING, NUMBER, INTEGER, UNSIGNED_INTEGER, ARRAY, OBJECT, INT, UINT, BOOLEAN].join("|") + ")$",
				},
			},
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

function typeOfValue(value) {
	const type = Object.keys(TYPES).find(type => TYPES[type](value));
	if (type) {
		return type;
	}
	return UNKNOWN;
}

module.exports = {
	name: TYPE,
	priority: 50,
	validate,
	execute,
	config,
	TYPES,
	typeOfValue,
};

function execute({ rule, data }) {
	return new Promise((resolve, reject) => {
		loadCurrentValue(data);
		if (TYPES[rule.current.value](data.current.value)) {
			resolve(true);
		} else {
			reject(errorUtil.badRequestError("Invalid body", { type: ERRORS.TYPE, name: data.current.name, expected: rule.current.value, given: typeOfValue(data.current.value) }));
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

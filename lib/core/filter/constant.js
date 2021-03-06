module.exports = {
	IN_RULE: "inRule",
	MERGE_RULE: "mergeRule",
	OUT_RULE: "outRule",
	BODY: "body",
	PARAMETERS: "parameters",
	PERMISSION: "permission",
	NAME: "name",
	MODE: "mode",
	PROPERTIES: "properties",
	CONTENT: "content",
	REQUIRED: "required",
	TYPE: "type",
	CAST_TO: "castTo",
	MIN: "min",
	MAX: "max",
	MATCH: "match",
	OPTIONAL: "optional",
	CLEAN: "clean",
	VALIDATE: "validate",
	TRANSFORM: "transform",
	DEFAULT: "default",
	RESTRICTIVE: "restrictive",
	PERMISSIVE: "permissive",
	BEFORE_MERGE: "beforeMerge",
	FUNCTION: "function",
	FUNCTION_OR_ARRAY: "function or array",
	STRING: "string",
	REGEXP: RegExp,
	STRING_OR_REGEXP: "string or regexp",
	NUMBER: "number",
	INTEGER: "integer",
	INT: "int",
	UNSIGNED_INTEGER: "unsigned integer",
	UINT: "uint",
	ARRAY: "array",
	OBJECT: "object",
	BOOLEAN: "boolean",
	ERRORS: {
		MISSING: "missing",
		REASON_MISSING: "missing property",
		TYPE: "type",
		REASON_TYPE: "invalid type",
		RANGE: "range",
		REASON_RANGE: "invalid range",
		MATCH: "match",
		REASON_MATCH: "not matching",
	},
	USER_INPUT: "userInput",
	NONE: "none",
	UNKNOWN: "unknown",
	UNDEFINED: "undefined",
	SKIP: "skip",
	FORBIDDEN_USER_INPUT_REGEXP: "^((?!map|pick|find|forEach|mapToArray).)*$",
};

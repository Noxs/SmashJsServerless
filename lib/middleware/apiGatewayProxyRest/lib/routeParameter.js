const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();

class RouteParameter {
	constructor(keyword, position) {
		if (typeof keyword !== 'string') {
			throw new errorUtil.TypeError("First parameter of RouteParameter() must be a string, ", keyword);
		}
		this.keyword = keyword;
		if (typeof position !== 'number') {
			throw new errorUtil.TypeError("Second parameter of RouteParameter() must be a number, ", position);
		}
		this.position = position;
	}
}

module.exports = RouteParameter;

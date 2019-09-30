const { DEFAULT } = require("./constant.js");

class Headers {
	constructor(headers) {
		Object.assign(this, headers);
	}

	lastOf(header) {
		if (this[header]) {
			if (Array.isArray(this[header])) {
				return [...this[header]].pop();
			}
			return this[header];
		}
		return null;
	}
}

module.exports = Headers;

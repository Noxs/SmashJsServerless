const { COMMA } = require("./constant.js");

class Headers {
	constructor(headers) {
		for (const key in headers) {
			if (headers[key].indexOf(COMMA)) {
				headers[key] = headers[key].split(COMMA).trim();
			}
		}
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

	firstOf(header) {
		if (this[header]) {
			if (Array.isArray(this[header])) {
				return [...this[header]].shift();
			}
			return this[header];
		}
		return null;
	}
}

module.exports = Headers;

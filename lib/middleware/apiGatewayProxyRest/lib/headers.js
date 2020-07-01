const { COMMA } = require("./constant");

class Headers {
	constructor(headers) {
		for (const key in headers) {
			headers[key] = decodeURI(headers[key]);
		}
		Object.assign(this, headers);
	}

	lastOf(header) {
		if (this[header]) {
			if (this[header].indexOf && this[header].split && this[header].indexOf(COMMA)) {
				const headers = this[header].split(COMMA).map(item => item.trim());
				return headers.pop();
			}
			return this[header];
		}
		return null;
	}

	firstOf(header) {
		if (this[header]) {
			if (this[header].indexOf && this[header].split && this[header].indexOf(COMMA)) {
				const headers = this[header].split(COMMA).map(item => item.trim());
				return headers.shift();
			}
			return this[header];
		}
		return null;
	}
}

module.exports = Headers;

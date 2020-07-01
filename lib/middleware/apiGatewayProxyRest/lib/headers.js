const { COMMA } = require("./constant");

class Headers {
	constructor(headers) {
		for (const key in headers) {
			const newKey = key.toLowerCase();
			headers[newKey] = decodeURI(headers[key]);
			if (newKey !== key) {
				delete headers[key];
			}
		}
		Object.assign(this, headers);
	}

	lastOf(header) {
		header = header.toLowerCase();
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
		header = header.toLowerCase();
		if (this[header]) {
			if (this[header].indexOf && this[header].split && this[header].indexOf(COMMA)) {
				const headers = this[header].split(COMMA).map(item => item.trim());
				return headers.shift();
			}
			return this[header];
		}
		return null;
	}

	get(header) {
		header = header.toLowerCase();
		if (this[header]) {
			return this[header];
		}
		return null;
	}
}

module.exports = Headers;

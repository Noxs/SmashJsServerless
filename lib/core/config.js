const path = require('path');
const fs = require('fs');
const CONFIG_FILE = "config.json";

class Config {
	constructor(currentDir = process.cwd()) {
		this._currentDir = currentDir;
		this._file = path.resolve(path.join(this._currentDir, CONFIG_FILE));
		try {
			this._config = JSON.parse(fs.readFileSync(this._file));
			//this._config = require(this._file); // THIS IS NOT WORKING ANYMORE ....
		} catch (error) {
			throw new Error("Failed to load config.json, it must be in the root directory of your project: " + this._file);
		}
	}

	get(section) {
		if (section !== undefined && typeof section !== "string") {
			throw new Error('First parameter of get can be a string or undefined, ' + typeof section + " given");
		}
		if (section) {
			return this._byString(section);
		}
		return this._config;
	}

	_byString(string) {
		if (typeof string !== 'string') {
			throw new Error('First parameter of byString() must be a String.');
		}
		let object = this._config;
		string = string.replace(/\[(\w+)\]/g, '.$1');
		string = string.replace(/^\./, '');
		const a = string.split('.');
		for (let i = 0, n = a.length; i < n; i++) {
			const k = a[i];
			if (k in object) {
				object = object[k];
			} else {
				return undefined;
			}
		}
		return object;
	}
}

module.exports = Config;

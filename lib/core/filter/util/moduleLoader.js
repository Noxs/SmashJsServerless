const glob = require('glob');
const path = require('path');
const DEEP_EXT_JS = "/**/*.js";

class ModuleLoader {
	constructor(folder) {
		const files = glob.sync(path.resolve(path.join(folder, DEEP_EXT_JS)));
		this.modules = files.map(file => require(path.resolve(file)));
	}

	getModuleByName(name) {
		const findedModule = this.modules.find(oneModule => oneModule.name === name);
		if (findedModule) {
			return findedModule;
		}
		throw new Error("Misspelling of " + name + " or missing module " + name);
	}
}

module.exports = ModuleLoader;

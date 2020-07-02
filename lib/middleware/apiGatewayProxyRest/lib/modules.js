const path = require('path');
const glob = require("glob");

class Modules {
	constructor({ path, moduleValidator }) {
		this._path = path;
		this._moduleValidator = moduleValidator;
		this._modules = [];
		this._loadModulesSync();
	}

	_loadModulesSync() {
		const files = glob.sync(path.resolve(this._path));
		for (const file of files) {
			this.addModule(file);
		}
		return this;
	}

	addModule(modulePath) {
		if (typeof modulePath === "string") {
			const loadedModule = require(modulePath);// eslint-disable-line global-require
			if (typeof loadedModule.name !== "string") {
				throw new Error("Module " + modulePath + " must have a string called 'name'");
			}
			if (this._moduleValidator) {
				this._moduleValidator(loadedModule);
			}
			this._modules.push(loadedModule);
		} else {
			throw new Error("Parameter modulePath must be a string");
		}
		return this;
	}

	removeModule(name) {
		const index = this._modules.findIndex(module => module.name === name);
		if (index === -1) {
			throw new Error("Cannot find module " + name);
		} else {
			this._modules.splice(index, 1);
		}
		return this;
	}

	getModules() {
		return this._modules.sort((a, b) => {
			if (a.priority && b.priority) {
				return a.priority - b.priority;
			}
			return a.name - b.name;
		});
	}

	getModule(name) {
		const loadedModule = this._modules.find(module => module.name === name);
		if (!loadedModule) {
			throw new Error("Cannot find module " + name);
		}
		return loadedModule;
	}

	addModules(modules) {
		modules.forEach(module => this.addModule(module));
		return this;
	}

	removeModules(names) {
		names.forEach(name => this.removeModule(name));
		return this;
	}
}

module.exports = Modules;

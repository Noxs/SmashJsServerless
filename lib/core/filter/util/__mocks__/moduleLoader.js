class ModuleLoader {
	constructor() {
		this.modules = [];
	}

	getModuleByName(name) {
		const findedModule = this.modules.find(oneModule => oneModule.name === name);
		if (findedModule) {
			return findedModule;
		}
		throw new Error("Cannot find module " + name);
	}
}

module.exports = ModuleLoader;

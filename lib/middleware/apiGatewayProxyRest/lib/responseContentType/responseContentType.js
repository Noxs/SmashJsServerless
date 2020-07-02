const Modules = require("../modules");
const { HEADERS } = require("../constant");

class ResponseContentType extends Modules {
	constructor() {
		super({
			path: __dirname + "/modules/*.js",
			moduleValidator: loadedModule => {
				if ((typeof loadedModule.name !== "string" && typeof loadedModule.execute !== "function")
					|| (typeof loadedModule.isForMe !== "function" && typeof loadedModule.execute !== "function")) {
					throw new Error("Module must have (a string 'name' and a function 'execute') or (a funcion 'isForMe' and a function 'execute')");
				}
			},
		});
		this.template = null;
	}

	execute({ response, body }) {
		const module = this.getModule(response.headers.get(HEADERS.CONTENT_TYPE));
		return module.execute({ response, body });
	}

	getAvailableContentTypes() {
		return this.getModules().map(({ name }) => name);
	}
}

module.exports = ResponseContentType;

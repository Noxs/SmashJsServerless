const Modules = require("../modules");
const smash = require("../../../../../smash");
const { HEADERS } = require("../constant");
const errorUtil = smash.errorUtil();

class RequestContentType extends Modules {
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

	execute({ request, body }) {
		try {
			const module = this.getModule(request.headers[HEADERS.CONTENT_TYPE]);
			return module.execute({ request, body });
		} catch (error) {
			throw errorUtil.unsupportedMediaTypeError(request.headers[HEADERS.CONTENT_TYPE]);
		}
	}
}

module.exports = RequestContentType;

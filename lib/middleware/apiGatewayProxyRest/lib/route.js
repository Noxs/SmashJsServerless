const smash = require("../../../../smash.js");
const RouteParameter = require("./routeParameter.js");
const { METHODS, INTERPOLATION, DEFAULT, SLASH, PATH_REGEXP } = require("./constant.js");
const errorUtil = smash.errorUtil();

class Route {
	constructor(method, route, callback) {
		this._sanityCheckMethod(method);
		this._sanityCheckCallback(callback);
		this._sanityCheckRoute(route);
		this._buildRouteParameters(route);
	}

	_sanityCheckMethod(method) {
		if (typeof method !== 'string') {
			throw new errorUtil.TypeError("First parameter of Route() must be a string, ", method);
		}
		if (METHODS[method] !== method) {
			throw new errorUtil.TypeError("First parameter of Route() can be GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD; ", method);
		}
		this.method = method;
		return this;
	}

	_sanityCheckCallback(callback) {
		if (typeof callback !== 'function') {
			throw new errorUtil.TypeError("Third parameter of Route() must be a function, ", callback);
		}
		if (callback.length !== 2) {
			throw new errorUtil.TypeError("Third parameter of Route() must be a function witch takes 2 parameters: Request and Response, " + callback.length);
		}
		this.callback = callback;
		return this;
	}

	_sanityCheckRoute(route) {
		if (typeof route !== 'object') {
			throw new errorUtil.TypeError("Second parameter of Route() must be an object, ", route);
		}
		if (typeof route.path !== 'string') {
			throw new errorUtil.TypeError("Second parameter of Route() must have a string property called path, ", route.path);
		}
		if (typeof route.action !== 'string') {
			throw new errorUtil.TypeError("Second parameter of Route() must have a string property called action, ", route.action);
		}
		for (const key in route) {
			if (this[key]) {
				throw new Error("Action " + this.action + "cannot contain a property called " + key);
			}
			this[key] = route[key];
		}
		if (!this.version) {
			this.version = DEFAULT;
		}
		this.initialRouteData = route;
		return this;
	}

	_buildRouteParameters({ path }) {
		this.routeParameters = [];
		const keywords = [];
		const ressources = path.split(SLASH);
		ressources.map((resource, index) => {
			if (resource.startsWith(INTERPOLATION) === true) {
				if (resource.length < 2) {
					throw new Error("Invalid route parameter " + resource + " for route " + path + ", it should be minimum 1 char plus ':'");
				}
				this.routeParameters.push(new RouteParameter(resource, index));
				keywords.push(PATH_REGEXP);
			} else {
				keywords.push(resource);
			}
		});
		this.regexp = keywords.join(SLASH);
		return this;
	}

	_matchPath(path) {
		const regexp = new RegExp("^" + this.regexp + "$");
		return regexp.test(path);
	}

	_buildRequestParameters(path) {
		this.parameters = {};
		const parameters = path.split(SLASH);
		parameters.map((parameter, parameterIndex) => {
			this.routeParameters.map(routeParameter => {
				if (routeParameter.position === parameterIndex) {
					const currentIndex = routeParameter.keyword.substr(1);
					this.parameters[currentIndex] = decodeURIComponent(parameter);
				}
			});
		});
		return this;
	}

	match({ method, path, version }) {
		if (method === this.method && version === this.version && this._matchPath(path) === true) {
			this._buildRequestParameters(path);
			return true;
		}
		return false;
	}
}

module.exports = Route;

const smash = require("../../../../smash");
const errorUtil = smash.errorUtil();
const { METHODS } = require("./constant");
const Route = require("./route");

class Router {
	constructor() {
		this.routes = [];
	}

	_registerRoute(route, callback) {
		const routeObject = new Route(route, callback);
		this.routes.push(routeObject);
		this.routes.sort((a, b) => b.weight - a.weight);
		return routeObject;
	}

	_findRoute({ action, version }) {
		return this.routes.find(route => route.action === action && route.version && version);
	}

	get(route, callback) {
		return this._registerRoute(this._formatLegacyRoute(route, METHODS.GET), callback);
	}

	post(route, callback) {
		return this._registerRoute(this._formatLegacyRoute(route, METHODS.POST), callback);
	}

	put(route, callback) {
		return this._registerRoute(this._formatLegacyRoute(route, METHODS.PUT), callback);
	}

	delete(route, callback) {
		return this._registerRoute(this._formatLegacyRoute(route, METHODS.DELETE), callback);
	}

	patch(route, callback) {
		return this._registerRoute(this._formatLegacyRoute(route, METHODS.PATCH), callback);
	}

	options(route, callback) {
		return this._registerRoute(this._formatLegacyRoute(route, METHODS.OPTIONS), callback);
	}

	head(route, callback) {
		return this._registerRoute(this._formatLegacyRoute(route, METHODS.HEAD), callback);
	}

	sameAs(route, { action, version }) {
		const sameAsRoute = this._findRoute({ action, version });
		if (!sameAsRoute) {
			throw new Error("Not route found for action " + action + " / " + version + " for sameAs " + JSON.stringify(route));
		}
		return this._registerRoute(sameAsRoute.method, { ...sameAsRoute, ...route }, sameAsRoute.callback);
	}

	_formatLegacyRoute(route, method) {
		route = { ...route, request: { method, path: route.path } };
		delete route.path;
		return route;
	}

	register(endpoint, callback) {
		//TODO
		//transform data for compatibility
		//TODO
		//create route
		//create in rule in route
		//create merge rule in route
		//create out rule in route
		return this._registerRoute(endpoint, callback);
	}

	_matchRoutes(request) {
		return this.routes.find(route => route.match(request));
	}

	getRoutes() {
		return this.routes;
	}

	handleRequest(request) {
		const route = this._matchRoutes(request);
		if (!route) {
			throw errorUtil.notFoundError({ name: "Route", method: request.method, path: request.path, type: "Route", version: request.version }, "Route not found for " + request.method + " " + request.path);
		}
		request.route = route;
		return this;
	}
}

module.exports = Router;

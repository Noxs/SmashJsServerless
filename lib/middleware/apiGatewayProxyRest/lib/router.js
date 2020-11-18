const smash = require("../../../../smash");
const errorUtil = smash.errorUtil();
const { METHODS, DASH } = require("./constant");
const Route = require("./route");

class Router {
	constructor() {
		this.routes = [];
	}

	_orderVersions(versions) {
		return [...versions].sort((a, b) => {
			const [montha, yeara] = a.split(DASH);
			const [monthb, yearb] = b.split(DASH);
			if (yeara === yearb) {
				return montha - monthb;
			}
			return yeara > yearb;
		});
	}

	_registerRoutesBackward(routes, ordererdVersions) {
		for (let i = ordererdVersions.length; i > 0; i--) {
			const version = ordererdVersions[i];
			const previousVersion = ordererdVersions[i - 1];
			routes[version].forEach(action => {
				if (routes[previousVersion].indexOf(action) === -1) {
					const routeToRegister = this._findRoute({ action, version });
					routeToRegister.originalVersion = routeToRegister.version;
					routeToRegister.version = previousVersion;
					this.register(routeToRegister.originalRouteData, routeToRegister.callback);
					routes[previousVersion].push(action);
				}
			});
		}
		return this;
	}

	_registerRoutesForward(routes, ordererdVersions) {
		for (let i = 0; i < ordererdVersions.length - 1; i++) {
			const version = ordererdVersions[i];
			const nextVersion = ordererdVersions[i + 1];
			routes[version].forEach(action => {
				if (routes[nextVersion].indexOf(action) === -1) {
					const routeToRegister = this._findRoute({ action, version });
					routeToRegister.originalVersion = routeToRegister.version;
					routeToRegister.version = nextVersion;
					this.register(routeToRegister.originalRouteData, routeToRegister.callback);
					routes[nextVersion].push(action);
				}
			});
		}
		return this;
	}

	registerMissingRoutes() {
		const versions = new Set();
		this.routes.forEach(route => versions.add(route.version));
		if (versions.size > 1) {
			const routes = {};
			this.routes.forEach(route => {
				if (!routes[route.version]) {
					routes[route.version] = [];
				}
				routes[route.version].push(route.action);
			});
			const ordererdVersions = this._orderVersions(versions);
			this._registerRoutesBackward(routes, ordererdVersions);
			this._registerRoutesForward(routes, ordererdVersions);
		}
		return this;
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

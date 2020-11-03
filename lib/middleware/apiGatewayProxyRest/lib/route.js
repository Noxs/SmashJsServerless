const smash = require("../../../../smash");
const Joi = require('joi');
const RouteParameter = require("./routeParameter");
const InRuleProcessor = require("../../../core/filter/inRule/inRuleProcessor");
const MergeRuleProcessor = require("../../../core/filter/mergeRule/mergeRuleProcessor");
const OutRuleProcessor = require("../../../core/filter/outRule/outRuleProcessor");
const { INTERPOLATION, SLASH, PATH_REGEXP, HIGH, LOW } = require("./constant.js");
const errorUtil = smash.errorUtil();

const response = Joi.object({
	description: Joi.string().required(),
});

const responseWithBody = Joi.object({
	description: Joi.string().required(),
	body: Joi.object().required(),
});

const routeSchema = Joi.object({
	action: Joi.string().required().pattern(/^.+$/),
	version: Joi.string().required().pattern(/^.+$/),
	srn: Joi.string().pattern(/^.+$/),
	scope: Joi.string().pattern(/^.+$/),
	authentication: Joi.boolean(),
	request: Joi.object({
		method: Joi.string().required().pattern(/^POST|GET|PUT|PATCH|DELETE|HEAD|OPTIONS$/),
		path: Joi.string().required().pattern(/^\/.+$/),
		permission: [Joi.function(), Joi.array()],
		parameters: Joi.object(),
		body: Joi.object(),
	}).required(),
	update: Joi.object(),
	responses: Joi.object({
		ok: responseWithBody,
		created: responseWithBody,
		accepted: response,
		noContent: response,
		movedPermanently: response,
		found: response,
		temporaryRedirect: response,
		permanentRedirect: response,
		badRequest: responseWithBody,
		unauthorized: responseWithBody,
		forbidden: responseWithBody,
		notFound: responseWithBody,
		conflict: responseWithBody,
		internalServerError: responseWithBody,
		notImplemented: responseWithBody,
		serviceUnavailable: responseWithBody,
	})/* .required() FIX ME in version 13 enable this by default*/,
	tag: Joi.string()/* .required() FIX ME in version 13 enable this by default*/,
});

class Route {
	constructor(route, callback) {
		this._sanityCheckRoute(route);
		this._sanityCheckCallback(callback);
		this._buildRouteParameters();
		this._validateRules(route);
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
		const validation = routeSchema.validate(route);
		if (validation.error) {
			throw new Error("Invalid route " + route.action + "  " + validation.error);
		}
		for (const key in route) {
			if (this[key]) {
				throw new Error("Action " + route.action + "cannot contain a property called " + key);
			}
			this[key] = route[key];
		}
		return this;
	}

	get method() {
		return this.request.method;
	}

	get path() {
		return this.request.path;
	}

	_buildRouteParameters() {
		this.routeParameters = [];
		this.weight = 0;
		const keywords = [];
		const ressources = this.path.split(SLASH);
		ressources.map((resource, index) => {
			if (resource.startsWith(INTERPOLATION) === true) {
				if (resource.length < 2) {
					throw new Error("Invalid route parameter " + resource + " for route " + this.path + ", it should be minimum 1 char plus ':'");
				}
				this.routeParameters.push(new RouteParameter(resource, index));
				keywords.push(PATH_REGEXP);
				this.weight += (LOW * (index + 1));
			} else {
				keywords.push(resource);
				this.weight += (HIGH * (index + 1));
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

	_createInRule(route) {
		const inRule = { parameters: route.request.parameters, body: route.request.body, permission: route.request.permission };
		for (const key in inRule) {
			if (!inRule[key]) {
				delete inRule[key];
			}
		}
		return inRule;
	}

	_validateRules(route) {
		if (route.request.parameters || route.request.body || route.request.permission) {
			const inRuleProcessor = new InRuleProcessor({ action: route.action, version: route.version });
			const inRule = this._createInRule(route);
			inRuleProcessor.validate(inRule);
		}
		if (route.update) {
			const mergeRuleProcessor = new MergeRuleProcessor({ action: route.action, version: route.version });
			mergeRuleProcessor.validate(route.update);
		}
		if (route.responses) {
			for (const code in route.responses) {
				if (route.responses[code].body) {
					const outRuleProcessor = new OutRuleProcessor({ action: route.action, version: route.version });
					outRuleProcessor.validate(route.responses[code].body);
				}
			}
		}
		return this;
	}

	match({ method, path, version }) {
		if (method === this.method && version === this.version && this._matchPath(path) === true) {
			this._buildRequestParameters(path);
			return true;
		}
		return false;
	}

	hasInRule() {
		return Boolean(this.request.parameters || this.request.body || this.request.permission);
	}

	hasOutRule(code) {
		if (this.responses) {
			return Boolean(this.responses[code].body);
		}
		return false;
	}

	hasCode(code) {
		if (this.responses) {
			return Boolean(this.responses[code]);
		}
		return true;
	}

	cleanIn(request) {
		const processor = new InRuleProcessor({ action: this.action, version: this.version });
		const inRule = this._createInRule(this);
		return processor.process(inRule, request);
	}

	merge(target, source) {
		const processor = new MergeRuleProcessor({ action: this.action, version: this.version });
		return processor.process(this.update, { outData: target, inData: source });
	}

	cleanOut(code, body, context = {}) {
		const processor = new OutRuleProcessor({ action: this.action, version: this.version });
		return processor.process(this.responses[code].body, body, context);
	}
}

module.exports = Route;

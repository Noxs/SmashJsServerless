const smash = require("../../../../smash");
const logger = smash.logger();
const { DEFAULT, REQUEST_DEFAULT_VERSION } = require("./constant");
const Headers = require("./headers");
const RequestContentType = require("./requestContentType/requestContentType");
const requestContentType = new RequestContentType();

class Request {
	constructor(event, context) {
		this.setupRequestId(event);
		this.setupMethod(event);
		this.setupVersion(event);
		this.setupPath(event);
		this.setupHeaders(event);
		this.setupBody(event);
		this.setupParameters(event);
		this.setupUser(event);
		this._route = null;
		this.originalEvent = event;
		this.context = context;
	}

	setupMethod({ httpMethod }) {
		this.method = httpMethod;
		return this;
	}

	setupVersion({ queryStringParameters }) {
		const defaultVersion = smash.config ? smash.config.get(REQUEST_DEFAULT_VERSION) : null;
		this.version = defaultVersion ? defaultVersion : DEFAULT;
		if (queryStringParameters && (queryStringParameters.v || queryStringParameters.version)) {
			if (queryStringParameters.v) {
				this.version = queryStringParameters.v;
			} else {
				this.version = queryStringParameters.version;
			}
		}
		return this;
	}

	setupPath({ path }) {
		this.path = path;
		return this;
	}

	setupHeaders({ headers }) {
		this.headers = new Headers(headers);
		return this;
	}

	setupBody({ body }) {
		this.body = undefined;
		if (body) {
			requestContentType.execute({ request: this, body });
		}
		return this;
	}

	setupParameters({ queryStringParameters }) {
		this.parameters = {};
		if (queryStringParameters) {
			this.parameters = queryStringParameters;
		}
		return this;
	}

	setupUser({ requestContext }) {
		this.user = null;
		if (requestContext) {
			if (requestContext.authorizer) {
				this.user = { ...requestContext.authorizer };
			}
			if (requestContext.identity) {
				this.user = { ...this.user, ...requestContext.identity };
			}
		}
		return this;
	}

	setupRequestId({ requestContext }) {
		if (requestContext && requestContext.requestId) {
			this.requestId = requestContext.requestId;
			logger.info("RequestId: " + this.requestId);
		}
		return this;
	}

	hasInRule() {
		return this.route.hasInRule();
	}

	hasOutRule() {
		if (this.route) {
			return this.route.hasOutRule();
		}
		return false;
	}

	cleanIn() {
		return this.route.cleanIn(this);
	}

	isResponseCompliant(code) {
		if (this.route) {
			return this.route.hasCode(code);
		}
		return true;
	}

	update(source) {
		return this.route.merge(this.body, source);
	}

	set route(route) {
		this._route = route;
		this.parameters = { ...this.parameters, ...route.parameters };
		return this;
	}

	get route() {
		return this._route;
	}
}

module.exports = Request;

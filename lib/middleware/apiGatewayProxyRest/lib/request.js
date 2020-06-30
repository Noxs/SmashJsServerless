const smash = require("../../../../smash.js");
const errorUtil = smash.errorUtil();
const { DEFAULT, REQUEST_DEFAULT_VERSION, ERRORS, REQUEST_IS_BASE64_ENCODED } = require("./constant.js");
const Headers = require("./headers.js");
const xml = require('xml-js');

class Request {
	constructor(event, context) {
		this.setupMethod(event);
		this.setupVersion(event);
		this.setupPath(event);
		this.setupHeaders(event);
		this.setupBody(event);
		this.setupParameters(event);
		this.setupUser(event);
		this.setupRequestId(event);
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
			if (this.headers["Content-Type"] === "application/xml" || this.headers["Content-Type"] === "text/xml") {
				this.body = xml.xml2js(body, { compact: true, ignoreComment: true, alwaysChildren: true });
			} else {
				try {
					const isBase64Encoded = smash.config ? smash.config.get(REQUEST_IS_BASE64_ENCODED) : false;
					if (isBase64Encoded === true) {
						body = Buffer.from(body, 'base64').toString('utf8');
					}
					this.body = JSON.parse(body);
				} catch (error) {
					throw errorUtil.badRequestError("Invalid body", { type: ERRORS.MALFORMED, reason: ERRORS.REASON_MALFORMED });
				}
			}
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
		}
		return this;
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

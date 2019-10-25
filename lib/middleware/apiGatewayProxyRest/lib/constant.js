module.exports = {
	DEFAULT: "default",
	METHODS: {
		GET: "GET",
		POST: "POST",
		PUT: "PUT",
		PATCH: "PATCH",
		DELETE: "DELETE",
		OPTIONS: "OPTIONS",
		HEAD: "HEAD",
	},
	INTERPOLATION: ":",
	SLASH: "/",
	COMMA: ",",
	PATH_REGEXP: "[^\/]+",
	RESPONSE_HEADERS_DEFAULT: "apiGatewayProxy.response.headers.default",
	REQUEST_DEFAULT_VERSION: "apiGatewayProxy.request.version.default",
	ERRORS: {
		MALFORMED: "malformed JSON",
		REASON_MALFORMED: "malformed JSON",
	},
};

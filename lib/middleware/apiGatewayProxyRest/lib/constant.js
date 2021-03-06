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
	REQUEST_IS_BASE64_ENCODED: "apiGatewayProxy.request.body.isBase64Encoded",
	HEADERS: {
		CONTENT_TYPE: "Content-Type",
		ACCEPT: "Accept",
	},
	ERRORS: {
		MALFORMED_JSON: "malformed JSON",
		REASON_MALFORMED_JSON: "malformed JSON",
		MALFORMED_X_WWW_FORM_URLENCODED: "malformed x-www-form-urlencoded",
		REASON_MALFORMED_X_WWW_FORM_URLENCODED: "malformed x-www-form-urlencoded",
	},
	HIGH: 10,
	LOW: 1,
	DEFAULT_ACCEPT: "*/*",
	DEFAULT_CONTENT_TYPE: "application/json",
};

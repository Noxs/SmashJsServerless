const smash = require("../../../../../../smash");
const errorUtil = smash.errorUtil();
const { ERRORS, REQUEST_IS_BASE64_ENCODED } = require("../../constant");
const querystring = require('querystring');

const NAME = "application/x-www-form-urlencoded";

module.exports = {
	name: NAME,
	execute,
};

function execute({ request, body }) {
	try {
		const isBase64Encoded = smash.config ? smash.config.get(REQUEST_IS_BASE64_ENCODED) : false;
		if (isBase64Encoded === true) {
			body = Buffer.from(body, 'base64').toString('utf8');
		}
		request.body = querystring.parse(body);
	} catch (error) {
		throw errorUtil.badRequestError("Invalid body", { type: ERRORS.MALFORMED_X_WWW_FORM_URLENCODED, reason: ERRORS.REASON_MALFORMED_X_WWW_FORM_URLENCODED });
	}
}

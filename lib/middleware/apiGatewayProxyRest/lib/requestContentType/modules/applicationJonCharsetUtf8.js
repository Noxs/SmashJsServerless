const smash = require("../../../../../../smash");
const errorUtil = smash.errorUtil();
const { ERRORS, REQUEST_IS_BASE64_ENCODED } = require("../../constant");

const NAME = "application/json;charset=UTF-8";

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
		request.body = JSON.parse(body);
	} catch (error) {
		throw errorUtil.badRequestError("Invalid body", { type: ERRORS.MALFORMED_JSON, reason: ERRORS.REASON_MALFORMED_JSON });
	}
}

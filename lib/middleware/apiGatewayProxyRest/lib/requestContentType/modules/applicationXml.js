const smash = require("../../../../../../smash");
const errorUtil = smash.errorUtil();
const { ERRORS, REQUEST_IS_BASE64_ENCODED } = require("../../constant");
const parser = require('fast-xml-parser');

const NAME = "application/xml";

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
		request.body = parser.parse(body);
	} catch (error) {
		throw errorUtil.badRequestError("Invalid body", { type: ERRORS.MALFORMED_XML, reason: ERRORS.REASON_MALFORMED_XML });
	}
}

const Parser = require('fast-xml-parser').j2xParser;

const NAME = "text/xml";

module.exports = {
	name: NAME,
	execute,
	priority: 10,
	usableForError: true,
};

function execute({ body }) {
	const parser = new Parser();
	return typeof body === 'object' ? parser.parse({ response: body }) : body;
}

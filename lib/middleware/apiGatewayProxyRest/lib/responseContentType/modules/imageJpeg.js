const NAME = "image/jpeg";

module.exports = {
	name: NAME,
	execute,
	priority: 10,
	usableForError: false,
};

function execute({ body }) {
	return Buffer.from(body).toString('base64');
}

const NAME = "application/json";

module.exports = {
	name: NAME,
	execute,
	priority: 0,
};

function execute({ body }) {
	return typeof body === 'object' ? JSON.stringify(body) : body;
}

const NAME = "application/json;charset=UTF-8";

module.exports = {
	name: NAME,
	execute,
	priority: 0,
};

function execute({ body }) {
	return typeof body === 'object' ? JSON.stringify(body) : body;
}

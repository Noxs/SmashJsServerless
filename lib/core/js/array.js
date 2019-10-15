try {
	Object.defineProperty(
		Array.prototype,
		'last',
		{
			enumerable: false,
			configurable: false,
			writable: false,
			value: last,
		}
	);
} catch (error) {
	if (!jest) {
		console.info("last already declared");
	}
}

function last() {
	return this[this.length - 1];
}

try {
	Object.defineProperty(
		Array.prototype,
		'first',
		{
			enumerable: false,
			configurable: false,
			writable: false,
			value: first,
		}
	);
} catch (error) {
	if (!jest) {
		console.info("first already declared");
	}
}

function first() {
	return this[0];
}

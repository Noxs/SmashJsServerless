try {
	Object.defineProperty(
		Array.prototype,
		'last',
		{
			enumerable: false,
			configurable: false,
			writable: true,
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
			writable: true,
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

try {
	Object.defineProperty(
		Array.prototype,
		'equals',
		{
			enumerable: false,
			configurable: false,
			writable: true,
			value: equals,
		}
	);
} catch (error) {
	if (!jest) {
		console.info("equals already declared");
	}
}

function equals(array) {
	if (!array)
		return false;
	if (this.length != array.length)
		return false;
	for (let i = 0; i < this.length; i++) {
		if (this[i] instanceof Array && array[i] instanceof Array) {
			if (!this[i].equals(array[i]))
				return false;
		} else if (this[i] != array[i]) {
			return false;
		}
	}
	return true;
}

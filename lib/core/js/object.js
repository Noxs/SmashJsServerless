try {
	Object.defineProperty(
		Object.prototype,
		'forEach',
		{
			enumerable: false,
			configurable: false,
			writable: false,
			value: forEach,
		}
	);
} catch (error) {
	if (!jest) {
		console.info('forEach already declared');
	}
}

function forEach(callback, thisArg) {
	Object.keys(this).forEach(key => {
		callback.apply(thisArg, [this[key], key, this]);
	});
}

try {
	Object.defineProperty(
		Object.prototype,
		'filter',
		{
			enumerable: false,
			configurable: false,
			writable: false,
			value: filter,
		}
	);
} catch (error) {
	if (!jest) {
		console.info('filter already declared');
	}
}

function filter(callback, thisArg) {
	const filtered = [];
	Object.keys(this).forEach(key => {
		if (callback.apply(thisArg, [this[key], key, this])) {
			filtered.push(key);
		}
	});
	return filtered;
}

try {
	Object.defineProperty(
		Object.prototype,
		'find',
		{
			enumerable: false,
			configurable: false,
			writable: false,
			value: find,
		}
	);
} catch (error) {
	if (!jest) {
		console.info('find already declared');
	}
}

function find(callback, thisArg) {
	const keys = Object.keys(this);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (callback.apply(thisArg, [this[key], key, this])) {
			return key;
		}
	}
}
try {
	Object.defineProperty(
		Object.prototype,
		'pick',
		{
			enumerable: false,
			configurable: false,
			writable: false,
			value: pick,
		}
	);
} catch (error) {
	if (!jest) {
		console.info('pick already declared');
	}
}

function pick(array) {
	const newObject = {};
	array.forEach(key => {
		if (this[key] !== undefined) {
			newObject[key] = this[key];
		}
	});
	return newObject;
}

try {
	Object.defineProperty(
		Object.prototype,
		'map',
		{
			enumerable: false,
			configurable: false,
			writable: false,
			value: map,
		}
	);
} catch (error) {
	if (!jest) {
		console.info('map already declared');
	}
}

function map(callback, thisArg) {
	const newObject = {};
	Object.keys(this).forEach(key => {
		newObject[key] = callback.apply(thisArg, [this[key], key, this]);
	});
	return newObject;
}

//some
//every
//flat

module.exports = {
	extend,
	map,
	find,
	pick,
	last,
	first,
	equals,
	filter,
	forEach,
};

const objectProperties = [
	{ key: 'map', parameters: { enumerable: false, configurable: false, writable: false, value: map } },
	{ key: 'pick', parameters: { enumerable: false, configurable: false, writable: false, value: pick } },
	{ key: 'find', parameters: { enumerable: false, configurable: false, writable: false, value: find } },
	{ key: 'filter', parameters: { enumerable: false, configurable: false, writable: false, value: filter } },
	{ key: 'forEach', parameters: { enumerable: false, configurable: false, writable: false, value: forEach } },
];

const arrayProperties = [
	{ key: 'last', parameters: { enumerable: false, configurable: false, writable: false, value: last } },
	{ key: 'first', parameters: { enumerable: false, configurable: false, writable: false, value: first } },
	{ key: 'equals', parameters: { enumerable: false, configurable: false, writable: false, value: equals } },
];

function assignProperties(object, properties) {
	properties.forEach(({ key, parameters }) => {
		if (!object[key]) {
			object = Object.defineProperty(
				object,
				key,
				parameters,
			);
		}
	});
	return object;
}

function extend(object) {
	if (typeof object === "object" && Array.isArray(object) === false) {
		assignProperties(object, objectProperties);
	} else if (Array.isArray(object) === true) {
		assignProperties(object, arrayProperties);
	}
	return object;
}

function forEach(callback, thisArg) {
	Object.keys(this).forEach(key => {
		callback.apply(thisArg, [this[key], key, this]);
	});
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

function find(callback, thisArg) {
	const keys = Object.keys(this);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (callback.apply(thisArg, [this[key], key, this])) {
			return key;
		}
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

function map(callback, thisArg) {
	const newObject = {};
	Object.keys(this).forEach(key => {
		newObject[key] = callback.apply(thisArg, [this[key], key, this]);
	});
	return newObject;
}

function last() {
	return this[this.length - 1];
}

function first() {
	return this[0];
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

//some
//every
//flat

const Binder = require('../../lib/core/binder.js');

describe('Binder', () => {
	it('Test binder instance success', () => {
		expect(() => {
			new Binder();
		}).not.toThrow(Error);
	});

	it('Test binder _addToArray method success', () => {
		const binder = new Binder();
		const source1 = "Banana";
		const source2 = ["Apple", "Orange"];
		const source3 = undefined;
		const target1 = [];
		const target2 = [];
		const target3 = ["Grape"];
		const target4 = ["Pear"];
		const target5 = ["Pear"];
		const arrayReturned1 = binder._addToArray(source1, target1);
		expect(target1).toEqual(["Banana"]);
		expect(arrayReturned1).toEqual(target1);

		const arrayReturned2 = binder._addToArray(source2, target2);
		expect(target2).toEqual(["Apple", "Orange"]);
		expect(arrayReturned2).toEqual(target2);

		const arrayReturned3 = binder._addToArray(source1, target3);
		expect(target3).toEqual(["Grape", "Banana"]);
		expect(arrayReturned3).toEqual(target3);

		const arrayReturned4 = binder._addToArray(source2, target4);
		expect(target4).toEqual(["Pear", "Apple", "Orange"]);
		expect(arrayReturned4).toEqual(target4);

		const arrayReturned5 = binder._addToArray(source3, target5);
		expect(target5).toEqual(["Pear"]);
		expect(arrayReturned5).toEqual(target5);
	});

	it('Test binder _addToArray method failure', () => {
		const binder = new Binder();
		const source = "Banana";
		const target = "";
		expect(() => {
			binder._addToArray(source, target);
		}).toThrow(binder.BadParameterError);
	});

	it('Test binder _checkRuleNameUniqness method success', () => {
		const binder = new Binder();

		const rule = { name: "uniq" };
		const ruleObject = {};

		expect(() => {
			binder._checkRuleNameUniqness(rule, ruleObject);
		}).not.toThrow();
	});

	it('Test binder _checkRuleNameUniqness method failure', () => {
		const binder = new Binder();

		const rule1 = {};
		const rule2 = { name: "duplicate" };
		const ruleObject = { duplicate: {} };

		expect(() => {
			binder._checkRuleNameUniqness(rule1, ruleObject);
		}).toThrow(binder.MissingPropertyError);
		expect(() => {
			binder._checkRuleNameUniqness(rule2, ruleObject);
		}).toThrow(binder.AlreadyExistError);
	});

	it('Test binder _registerRequiredRule method success', () => {
		const binder = new Binder();

		expect(() => {
			binder._registerRequiredRule({ name: "test", way: "required", required: { id: {} } });
		}).not.toThrow();

		const rule = { name: "foobar", way: "required", required: { id: {} } };
		binder._registerRequiredRule(rule);
		expect(binder._requiredConfiguration.foobar).toEqual(rule);
	});

	it('Test binder _registerRequiredRule method failure', () => {
		const binder = new Binder();

		expect(() => {
			binder._registerRequiredRule({ name: "test", way: "required" });
		}).toThrow(binder.MissingPropertyError);
	});

	it('Test binder _registerRequiredRule method failure invalid type', () => {
		const binder = new Binder();

		expect(() => {
			binder._registerRequiredRule({ name: "test", way: "required", required: { id: { type: "foobar" } } });
		}).toThrow(binder.InvalidTypeError);
	});

	it('Test binder _registerUpdateRule method success', () => {
		const binder = new Binder();

		expect(() => {
			binder._registerUpdateRule({ name: "test", way: "update", mode: "permissive", property_list: ["id"] });
		}).not.toThrow();

		const rule = { name: "foobar", way: "update", mode: "restrictive", property_list: ["id"] }
		binder._registerUpdateRule(rule);
		expect(binder._updateConfiguration.foobar).toEqual(rule);
	});

	it('Test binder _registerUpdateRule method failure', () => {
		const binder = new Binder();

		expect(() => {
			binder._registerUpdateRule({ name: "foobar", way: "update", property_list: ["id"] });
		}).toThrow(binder.MissingPropertyError);

		expect(() => {
			binder._registerUpdateRule({ name: "foobar", way: "update", mode: "foo", property_list: ["id"] });
		}).toThrow(binder.UnknownModeError);

		expect(() => {
			binder._registerUpdateRule({ name: "foobar", way: "update", mode: "permissive" });
		}).toThrow(binder.MissingPropertyError);
	});

	it('Test binder _registerCleanRule method success', () => {
		const binder = new Binder();

		expect(() => {
			binder._registerCleanRule({ name: "test", way: "clean", mode: "permissive", property_list: ["id"] });
		}).not.toThrow();

		const rule = { name: "foobar", way: "clean", mode: "restrictive", property_list: ["id"] }
		binder._registerCleanRule(rule);
		expect(binder._cleanConfiguration.foobar).toEqual(rule);
	});

	it('Test binder _registerCleanRule method failure', () => {
		const binder = new Binder();

		expect(() => {
			binder._registerCleanRule({ name: "foobar", way: "clean", property_list: ["id"] });
		}).toThrow(binder.MissingPropertyError);

		expect(() => {
			binder._registerCleanRule({ name: "foobar", way: "clean", mode: "foo", property_list: ["id"] });
		}).toThrow(binder.UnknownModeError);

		expect(() => {
			binder._registerCleanRule({ name: "foobar", way: "clean", mode: "permissive" });
		}).toThrow(binder.MissingPropertyError);
	});

	it('Test binder registerRule method success', () => {
		const binder = new Binder();

		expect(() => {
			binder.registerRule({ name: "test", way: "update", mode: "permissive", property_list: ["id"] });
		}).not.toThrow();

		expect(() => {
			binder.registerRule({ name: "test", way: "required", required: { id: {} } });
		}).not.toThrow();

		const rule = { name: "foobar", way: "clean", mode: "restrictive", property_list: ["id"] }
		binder.registerRule(rule);
		expect(binder._cleanConfiguration.foobar).toEqual(rule);
	});

	it('Test binder registerRule method failure', () => {
		const binder = new Binder();
		const rule1 = {};
		const badRule1 = "badRule1";

		expect(() => {
			binder.registerRule(rule1);
		}).toThrow(binder.UnknownWayError);
		expect(() => {
			binder.registerRule(badRule1);
		}).toThrow(binder.BadParameterError);
	});

	it('Test binder hasRequired method success', () => {
		const binder = new Binder();

		const rule1 = {
			name: "foobar",
			way: "required",
			required: {
				id: { type: "unsigned integer", min_value: 0, max_value: 999999999 },
				type: { type: "string", match: "^[a-z]{1,10}$" },
				active: { type: "boolean" },
				negative_integer: { type: "integer", max_value: -1, min_value: -99999999 },
				array_number: { type: "array" },
				custom_object: { type: "object", optional: true }
			}
		};
		binder.registerRule(rule1);

		const data1 = { id: 123456789, type: "user", active: false, negative_integer: -123456, array_number: [], custom_object: {}, extra_field: "this is an extra field not registered as property" };
		const data2 = [{ id: 1, type: "user", active: true, negative_integer: -9123456, array_number: [], custom_object: {} }, { id: 2, type: "user", active: false, negative_integer: -98123456, array_number: [], custom_object: {} }];
		const data3 = {};
		const data4 = [{ id: 1, active: "notaboolean" }, { id: -1, type: "useruseruser", negative_integer: 1 }, { custom_object: true }];

		expect(binder.hasRequired(rule1.name, data1)).toBe(true);
		expect(data1.extra_field).toBe(undefined);
		expect(binder.hasRequired(rule1.name, data2)).toBe(true);

		const returnedMissing1 = binder.hasRequired(rule1.name, data3);
		expect(returnedMissing1).toEqual([
			{ type: binder.Errors.MISSING, name: "id" },
			{ type: binder.Errors.MISSING, name: "type" },
			{ type: binder.Errors.MISSING, name: "active" },
			{ type: binder.Errors.MISSING, name: "negative_integer" },
			{ type: binder.Errors.MISSING, name: "array_number" },
		]);

		const returnedMissing2 = binder.hasRequired(rule1.name, data4);
		expect(returnedMissing2).toEqual([
			{ type: binder.Errors.MISSING, name: "type" },
			{ type: binder.Errors.TYPE, name: "active", expected: "boolean", given: "notaboolean" },
			{ type: binder.Errors.MISSING, name: "negative_integer" },
			{ type: binder.Errors.MISSING, name: "array_number" },
			{ type: binder.Errors.RANGE, name: "id" },
			{ type: binder.Errors.MATCH, name: "type" },
			{ type: binder.Errors.MISSING, name: "active" },
			{ type: binder.Errors.RANGE, name: "negative_integer" },
			{ type: binder.Errors.MISSING, name: "array_number" },
			{ type: binder.Errors.MISSING, name: "id" },
			{ type: binder.Errors.MISSING, name: "type" },
			{ type: binder.Errors.MISSING, name: "active" },
			{ type: binder.Errors.MISSING, name: "negative_integer" },
			{ type: binder.Errors.MISSING, name: "array_number" },
			{ type: binder.Errors.TYPE, name: "custom_object", expected: "object", given: true },
		]);

		const returnedMissing3 = binder.hasRequired(rule1.name, null);
		expect(returnedMissing3).toEqual([
			{ type: binder.Errors.MISSING, name: "id" },
			{ type: binder.Errors.MISSING, name: "type" },
			{ type: binder.Errors.MISSING, name: "active" },
			{ type: binder.Errors.MISSING, name: "negative_integer" },
			{ type: binder.Errors.MISSING, name: "array_number" },
		]);
	});

	it('Test binder hasRequired method failure', () => {
		const binder = new Binder();

		const rule = {
			name: "foobarwithmistake",
			way: "required",
			required: {
				id: {},
				type: {}
			}
		};
		binder.registerRule(rule);
		const data = { id: "123456789", type: "user" };
		expect(() => {
			binder.hasRequired("foobar", data);
		}).toThrow(binder.UnknownRuleError);
	});

	it('Test binder update method success', () => {
		const binder = new Binder();

		const rule1 = { name: "foobar1", way: "update", mode: "restrictive", property_list: ["username", "type"] };
		const rule2 = { name: "foobar2", way: "update", mode: "permissive", property_list: ["key", "password"] };
		binder.registerRule(rule1);
		binder.registerRule(rule2);

		const newData1 = { id: "123456789new", username: "foobar@foobar.com", password: "keyboardnew", key: "dvoraknew", created: "yesterdaynew", updated: "todaynew" };
		const oldData1 = { id: "123456789", username: "foo@bar.com", password: "keyboard", key: "dvorak", created: "yesterday", updated: "today" };
		const newData2 = [{ id: "1new", username: "foobar@foobar.com", password: "qwertynew", key: "azertynew", created: "yesterdaynew", updated: "todaynew" }, { id: "2new", username: "foobar@foobar.eu", password: "azertynew", key: "qwertynew" }];
		const oldData2 = [{ id: "1", username: "foo@bar.com", password: "qwerty", key: "azerty", created: "yesterday", updated: "today" }, { id: "2", username: "foo@bar.eu", password: "azerty", key: "qwerty" }];

		const returned1 = binder.update(rule1.name, newData1, oldData1);
		expect(returned1).toEqual({ id: "123456789", username: "foobar@foobar.com", password: "keyboard", key: "dvorak", created: "yesterday", updated: "today" });

		const returned2 = binder.update(rule1.name, newData2, oldData2);
		expect(returned2).toEqual([{ id: "1", username: "foobar@foobar.com", password: "qwerty", key: "azerty", created: "yesterday", updated: "today" }, { id: "2", username: "foobar@foobar.eu", password: "azerty", key: "qwerty" }]);

		const returned3 = binder.update(rule2.name, newData1, oldData1);
		expect(returned3).toEqual({ id: "123456789new", username: "foobar@foobar.com", password: "keyboard", key: "dvorak", created: "yesterdaynew", updated: "todaynew" });

		const returned4 = binder.update(rule2.name, newData2, oldData2);
		expect(returned4).toEqual([{ id: "1new", username: "foobar@foobar.com", password: "qwerty", key: "azerty", created: "yesterdaynew", updated: "todaynew" }, { id: "2new", username: "foobar@foobar.eu", password: "azerty", key: "qwerty" }]);

		const returned5 = binder.update(rule2.name, newData2);
		expect(returned5).toEqual([{ id: "1new", username: "foobar@foobar.com", created: "yesterdaynew", updated: "todaynew" }, { id: "2new", username: "foobar@foobar.eu" }]);

	});

	it('Test binder update method failure', () => {
		const binder = new Binder();

		const rule = { name: "foobarwithmistake", way: "update", mode: "permissive", property_list: ["id", "type"] };
		binder.registerRule(rule);
		const data = { id: "123456789", type: "user" };
		expect(() => {
			binder.update("foobar", data);
		}).toThrow(binder.UnknownRuleError);
	});

	it('Test binder clean method success', () => {
		const binder = new Binder();

		const rule1 = { name: "foobar1", way: "clean", mode: "restrictive", property_list: ["id", "username", "created"] };
		const rule2 = { name: "foobar2", way: "clean", mode: "permissive", property_list: ["key", "password"] };
		binder.registerRule(rule1);
		binder.registerRule(rule2);

		const data1 = { id: "123456789", username: "foo@bar.com", password: "keyboard", key: "dvorak", created: "yesterday", updated: "today" };
		const data2 = [{ id: "1", username: "foo@bar.com", password: "qwerty", key: "azerty", created: "yesterday", updated: "today" }, { id: "2", username: "foo@bar.eu", password: "azerty", key: "qwerty" }];

		const returned1 = binder.clean(rule1.name, data1);
		expect(returned1).toEqual([{ id: "123456789", username: "foo@bar.com", created: "yesterday" }]);

		const returned2 = binder.clean(rule1.name, data2);
		expect(returned2).toEqual([{ id: "1", username: "foo@bar.com", created: "yesterday" }, { id: "2", username: "foo@bar.eu" }]);

		const returned3 = binder.clean(rule2.name, data1);
		expect(returned3).toEqual([{ id: "123456789", username: "foo@bar.com", created: "yesterday", updated: "today" }]);

		const returned4 = binder.clean(rule2.name, data2);
		expect(returned4).toEqual([{ id: "1", username: "foo@bar.com", created: "yesterday", updated: "today" }, { id: "2", username: "foo@bar.eu" }]);
	});

	it('Test binder clean method failure', () => {
		const binder = new Binder();

		const rule = { name: "foobarwithmistake", way: "clean", mode: "permissive", property_list: ["id", "type"] };
		binder.registerRule(rule);
		const data = { id: "123456789", type: "user" };
		expect(() => {
			binder.clean("foobar", data);
		}).toThrow(binder.UnknownRuleError);
	});
});

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Binder = require('../../lib/core/binder.js');

describe('Binder', function () {

    it('Test binder instance success', function () {
        expect(function () {
            const binder = new Binder();
        }).to.not.throw(Error);
    });

    it('Test binder _addToArray method success', function () {
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
        assert.deepEqual(target1, ["Banana"]);
        assert.deepEqual(arrayReturned1, target1);

        const arrayReturned2 = binder._addToArray(source2, target2);
        assert.deepEqual(target2, ["Apple", "Orange"]);
        assert.deepEqual(arrayReturned2, target2);

        const arrayReturned3 = binder._addToArray(source1, target3);
        assert.deepEqual(target3, ["Grape", "Banana"]);
        assert.deepEqual(arrayReturned3, target3);

        const arrayReturned4 = binder._addToArray(source2, target4);
        assert.deepEqual(target4, ["Pear", "Apple", "Orange"]);
        assert.deepEqual(arrayReturned4, target4);

        const arrayReturned5 = binder._addToArray(source3, target5);
        assert.deepEqual(target5, ["Pear"]);
        assert.deepEqual(arrayReturned5, target5);
    });

    it('Test binder _addToArray method failure', function () {
        const binder = new Binder();
        const source = "Banana";
        const target = "";
        expect(function () {
            binder._addToArray(source, target);
        }).to.throw(binder.BadParameterError);
    });

    it('Test binder _checkRuleNameUniqness method success', function () {
        const binder = new Binder();

        const rule = { name: "uniq" };
        const ruleObject = {};

        expect(function () {
            binder._checkRuleNameUniqness(rule, ruleObject);
        }).to.not.throw();
    });

    it('Test binder _checkRuleNameUniqness method failure', function () {
        const binder = new Binder();

        const rule1 = {};
        const rule2 = { name: "duplicate" };
        const ruleObject = { duplicate: {} };

        expect(function () {
            binder._checkRuleNameUniqness(rule1, ruleObject);
        }).to.throw(binder.MissingPropertyError);
        expect(function () {
            binder._checkRuleNameUniqness(rule2, ruleObject);
        }).to.throw(binder.AlreadyExistError);
    });

    it('Test binder _registerRequiredRule method success', function () {
        const binder = new Binder();

        expect(function () {
            binder._registerRequiredRule({ name: "test", way: "required", required: { id: {} } });
        }).to.not.throw();

        const rule = { name: "foobar", way: "required", required: { id: {} } };
        binder._registerRequiredRule(rule);
        assert.deepEqual(binder._requiredConfiguration.foobar, rule);
    });

    it('Test binder _registerRequiredRule method failure', function () {
        const binder = new Binder();

        expect(function () {
            binder._registerRequiredRule({ name: "test", way: "required" });
        }).to.throw(binder.MissingPropertyError);
    });

    it('Test binder _registerRequiredRule method failure invalid type', function () {
        const binder = new Binder();

        expect(function () {
            binder._registerRequiredRule({ name: "test", way: "required", required: { id: { type: "foobar" } } });
        }).to.throw(binder.InvalidTypeError);
    });

    it('Test binder _registerUpdateRule method success', function () {
        const binder = new Binder();

        expect(function () {
            binder._registerUpdateRule({ name: "test", way: "update", mode: "permissive", property_list: ["id"] });
        }).to.not.throw();

        const rule = { name: "foobar", way: "update", mode: "restrictive", property_list: ["id"] }
        binder._registerUpdateRule(rule);
        assert.deepEqual(binder._updateConfiguration.foobar, rule);
    });

    it('Test binder _registerUpdateRule method failure', function () {
        const binder = new Binder();

        expect(function () {
            binder._registerUpdateRule({ name: "foobar", way: "update", property_list: ["id"] });
        }).to.throw(binder.MissingPropertyError);

        expect(function () {
            binder._registerUpdateRule({ name: "foobar", way: "update", mode: "foo", property_list: ["id"] });
        }).to.throw(binder.UnknownModeError);

        expect(function () {
            binder._registerUpdateRule({ name: "foobar", way: "update", mode: "permissive" });
        }).to.throw(binder.MissingPropertyError);
    });

    it('Test binder _registerCleanRule method success', function () {
        const binder = new Binder();

        expect(function () {
            binder._registerCleanRule({ name: "test", way: "clean", mode: "permissive", property_list: ["id"] });
        }).to.not.throw();

        const rule = { name: "foobar", way: "clean", mode: "restrictive", property_list: ["id"] }
        binder._registerCleanRule(rule);
        assert.deepEqual(binder._cleanConfiguration.foobar, rule);
    });

    it('Test binder _registerCleanRule method failure', function () {
        const binder = new Binder();

        expect(function () {
            binder._registerCleanRule({ name: "foobar", way: "clean", property_list: ["id"] });
        }).to.throw(binder.MissingPropertyError);

        expect(function () {
            binder._registerCleanRule({ name: "foobar", way: "clean", mode: "foo", property_list: ["id"] });
        }).to.throw(binder.UnknownModeError);

        expect(function () {
            binder._registerCleanRule({ name: "foobar", way: "clean", mode: "permissive" });
        }).to.throw(binder.MissingPropertyError);
    });

    it('Test binder registerRule method success', function () {
        const binder = new Binder();

        expect(function () {
            binder.registerRule({ name: "test", way: "update", mode: "permissive", property_list: ["id"] });
        }).to.not.throw();

        expect(function () {
            binder.registerRule({ name: "test", way: "required", required: { id: {} } });
        }).to.not.throw();

        const rule = { name: "foobar", way: "clean", mode: "restrictive", property_list: ["id"] }
        binder.registerRule(rule);
        assert.deepEqual(binder._cleanConfiguration.foobar, rule);
    });

    it('Test binder registerRule method failure', function () {
        const binder = new Binder();
        const rule1 = {};
        const badRule1 = "badRule1";

        expect(function () {
            binder.registerRule(rule1);
        }).to.throw(binder.UnknownWayError);
        expect(function () {
            binder.registerRule(badRule1);
        }).to.throw(binder.BadParameterError);
    });

    it('Test binder hasRequired method success', function () {
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

        assert.isTrue(binder.hasRequired(rule1.name, data1));
        assert.isUndefined(data1.extra_field);
        assert.isTrue(binder.hasRequired(rule1.name, data2));

        const returnedMissing1 = binder.hasRequired(rule1.name, data3);
        assert.deepEqual(returnedMissing1, [
            { type: binder.Errors.MISSING, name: "id" },
            { type: binder.Errors.MISSING, name: "type" },
            { type: binder.Errors.MISSING, name: "active" },
            { type: binder.Errors.MISSING, name: "negative_integer" },
            { type: binder.Errors.MISSING, name: "array_number" },
        ]);

        const returnedMissing2 = binder.hasRequired(rule1.name, data4);
        assert.deepEqual(returnedMissing2, [
            { type: binder.Errors.MISSING, name: "type" },
            { type: binder.Errors.TYPE, name: "active" },
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
            { type: binder.Errors.TYPE, name: "custom_object" },
        ]);

        const returnedMissing3 = binder.hasRequired(rule1.name, null);
        assert.deepEqual(returnedMissing3, [
            { type: binder.Errors.MISSING, name: "id" },
            { type: binder.Errors.MISSING, name: "type" },
            { type: binder.Errors.MISSING, name: "active" },
            { type: binder.Errors.MISSING, name: "negative_integer" },
            { type: binder.Errors.MISSING, name: "array_number" },
        ]);
    });

    it('Test binder hasRequired method failure', function () {
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
        expect(function () {
            assert.isTrue(binder.hasRequired("foobar", data));
        }).to.throw(binder.UnknownRuleError);
    });

    it('Test binder update method success', function () {
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
        assert.deepEqual(returned1, { id: "123456789", username: "foobar@foobar.com", password: "keyboard", key: "dvorak", created: "yesterday", updated: "today" });

        const returned2 = binder.update(rule1.name, newData2, oldData2);
        assert.deepEqual(returned2, [{ id: "1", username: "foobar@foobar.com", password: "qwerty", key: "azerty", created: "yesterday", updated: "today" }, { id: "2", username: "foobar@foobar.eu", password: "azerty", key: "qwerty" }]);

        const returned3 = binder.update(rule2.name, newData1, oldData1);
        assert.deepEqual(returned3, { id: "123456789new", username: "foobar@foobar.com", password: "keyboard", key: "dvorak", created: "yesterdaynew", updated: "todaynew" });

        const returned4 = binder.update(rule2.name, newData2, oldData2);
        assert.deepEqual(returned4, [{ id: "1new", username: "foobar@foobar.com", password: "qwerty", key: "azerty", created: "yesterdaynew", updated: "todaynew" }, { id: "2new", username: "foobar@foobar.eu", password: "azerty", key: "qwerty" }]);

        const returned5 = binder.update(rule2.name, newData2);
        assert.deepEqual(returned5, [{ id: "1new", username: "foobar@foobar.com", created: "yesterdaynew", updated: "todaynew" }, { id: "2new", username: "foobar@foobar.eu" }]);

    });

    it('Test binder update method failure', function () {
        const binder = new Binder();

        const rule = { name: "foobarwithmistake", way: "update", mode: "permissive", property_list: ["id", "type"] };
        binder.registerRule(rule);
        const data = { id: "123456789", type: "user" };
        expect(function () {
            assert.isTrue(binder.update("foobar", data));
        }).to.throw(binder.UnknownRuleError);
    });

    it('Test binder clean method success', function () {
        const binder = new Binder();

        const rule1 = { name: "foobar1", way: "clean", mode: "restrictive", property_list: ["id", "username", "created"] };
        const rule2 = { name: "foobar2", way: "clean", mode: "permissive", property_list: ["key", "password"] };
        binder.registerRule(rule1);
        binder.registerRule(rule2);

        const data1 = { id: "123456789", username: "foo@bar.com", password: "keyboard", key: "dvorak", created: "yesterday", updated: "today" };
        const data2 = [{ id: "1", username: "foo@bar.com", password: "qwerty", key: "azerty", created: "yesterday", updated: "today" }, { id: "2", username: "foo@bar.eu", password: "azerty", key: "qwerty" }];

        const returned1 = binder.clean(rule1.name, data1);
        assert.deepEqual(returned1, [{ id: "123456789", username: "foo@bar.com", created: "yesterday" }]);

        const returned2 = binder.clean(rule1.name, data2);
        assert.deepEqual(returned2, [{ id: "1", username: "foo@bar.com", created: "yesterday" }, { id: "2", username: "foo@bar.eu" }]);

        const returned3 = binder.clean(rule2.name, data1);
        assert.deepEqual(returned3, [{ id: "123456789", username: "foo@bar.com", created: "yesterday", updated: "today" }]);

        const returned4 = binder.clean(rule2.name, data2);
        assert.deepEqual(returned4, [{ id: "1", username: "foo@bar.com", created: "yesterday", updated: "today" }, { id: "2", username: "foo@bar.eu" }]);
    });

    it('Test binder clean method failure', function () {
        const binder = new Binder();

        const rule = { name: "foobarwithmistake", way: "clean", mode: "permissive", property_list: ["id", "type"] };
        binder.registerRule(rule);
        const data = { id: "123456789", type: "user" };
        expect(function () {
            assert.isTrue(binder.clean("foobar", data));
        }).to.throw(binder.UnknownRuleError);
    });
});

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const DynamodbModel = require("../../lib/util/dynamodbModel.js");

class TestEmpty extends DynamodbModel {

}

class TestCleanEmpty extends DynamodbModel {
    updateExclusion() {
        return [];
    }
}

class TestUpdateEmpty extends DynamodbModel {
    cleanInclusion() {
        return [];
    }
}

class TestBadReturn extends DynamodbModel {
    cleanInclusion() {
        return {};
    }
    updateExclusion() {
        return "";
    }
    required() {
        return "";
    }
}

class Test extends DynamodbModel {
    cleanInclusion() {
        return ["id", "secret"];
    }
    updateExclusion() {
        return ["id", "time"];
    }
    required() {
        return ["id", "time"];
    }
}

describe('DynamodbModel', function () {
    it('Test DynamodbModel instance', function () {
        expect(function () {
            const model = new DynamodbModel();
        }).to.throw(Error);

        expect(function () {
            const testEmpty = new TestEmpty();
            const test = new Test();
        }).to.not.throw(Error);

    });

    it('Test update function context', function () {
        const test = new Test();
        assert.isFunction(test.update);
        assert.isFunction(test.updateExclusion);

        const testEmpty = new TestEmpty();
        const testUpdateEmpty = new TestUpdateEmpty();
        const testBadReturn = new TestBadReturn();

        expect(function () {
            testEmpty.update({}, {});
        }).to.throw(Error);

        expect(function () {
            testEmpty.update(1, 1);
        }).to.throw(Error);

        expect(function () {
            testEmpty.update({}, 1);
        }).to.throw(Error);

        expect(function () {
            testUpdateEmpty.update({}, {});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.update({}, {});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.update({}, {});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.update([], {});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.update({}, []);
        }).to.throw(Error);

        expect(function () {
            test.update({}, {});
        }).to.not.throw();

        expect(function () {
            test.update({});
        }).to.not.throw();

    });

    it('Test update function context', function () {
        const test = new Test();
        assert.isObject(test.update({}, {}));

        const empty = {};
        assert.equal(test.update({}, empty), empty);

        const filled = { foo: "bar" };

        const frozenObject = Object.freeze({ foo: "bar", bar: "foo" });
        test.update(frozenObject, filled);
        expect(frozenObject).to.be.frozen;

        const extendedFilled = { foo: "bar", bar: "foo", thisisempty: "", thisisnull: null, id: "123546789" };
        const updatedObject = test.update(extendedFilled, { foo: "bar2" });
        assert.notEqual("bar2", updatedObject.foo);
        assert.equal(extendedFilled.thisisnull, updatedObject.updatedObject);
        assert.equal(updatedObject.thisisnull, undefined);
        assert.equal(updatedObject.id, undefined);

        const updatedObject2 = test.update(extendedFilled);
        assert.notEqual("bar2", updatedObject2.foo);
        assert.equal(extendedFilled.thisisnull, updatedObject2.updatedObject);
        assert.equal(updatedObject2.thisisnull, undefined);
        assert.equal(updatedObject2.id, undefined);

    });

    it('Test clean function', function () {
        const test = new Test();
        assert.isFunction(test.clean);
        assert.isFunction(test.cleanInclusion);

        const testEmpty = new TestEmpty();
        const testCleanEmpty = new TestCleanEmpty();
        const testBadReturn = new TestBadReturn();

        expect(function () {
            testEmpty.clean({});
        }).to.throw(Error);

        expect(function () {
            testEmpty.clean(1);
        }).to.throw(Error);

        expect(function () {
            testCleanEmpty.clean({});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.clean({});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.clean({});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.clean([]);
        }).to.throw(Error);

        expect(function () {
            testBadReturn.clean({});
        }).to.throw(Error);

        expect(function () {
            test.clean({});
        }).to.not.throw();
    });

    it('Test clean function context', function () {
        const test = new Test();
        assert.isObject(test.clean({}));

        const frozenObject = Object.freeze({ foo: "bar", bar: "foo", id: "123456789", secret: "thisisasecret" });
        test.clean(frozenObject);
        expect(frozenObject).to.be.frozen;

        const extendedFilled = { foo: "bar", bar: "foo", thisisempty: "", thisisnull: null, id: "123546789" };
        const updatedObject = test.clean(extendedFilled);
        assert.notEqual("bar2", updatedObject.foo);
        assert.equal(extendedFilled.thisisnull, updatedObject.updatedObject);
        assert.equal(updatedObject.thisisnull, null);
        assert.equal(updatedObject.id, undefined);
        assert.equal(updatedObject.secret, undefined);

    });

    it('Test clean function context', function () {
        const test = new Test();
        assert.isArray(test.clean([]));

        const frozenObject = Object.freeze({ foo: "bar", bar: "foo", id: "123456789", secret: "thisisasecret" });
        test.clean(frozenObject);
        expect(frozenObject).to.be.frozen;

        const extendedFilled = [{ foo: "bar", bar: "foo", thisisempty: "", thisisnull: null, id: "123546789" }, { foo: "bar", bar: "foo", thisisempty: "", thisisnull: null, id: "123546789" }];
        const updatedObject = test.clean(extendedFilled);
        assert.notEqual("bar2", updatedObject[0].foo);
        assert.notEqual("bar2", updatedObject[1].foo);
        assert.equal(extendedFilled[0].thisisnull, updatedObject[0].updatedObject);
        assert.equal(extendedFilled[1].thisisnull, updatedObject[1].updatedObject);
        assert.equal(updatedObject[0].thisisnull, null);
        assert.equal(updatedObject[1].thisisnull, null);
        assert.equal(updatedObject[0].id, undefined);
        assert.equal(updatedObject[1].id, undefined);
        assert.equal(updatedObject[0].secret, undefined);
        assert.equal(updatedObject[1].secret, undefined);

    });

    it('Test hasRequired function', function () {
        const test = new Test();
        assert.isFunction(test.required);
        assert.isFunction(test.hasRequired);

        const testEmpty = new TestEmpty();
        const testCleanEmpty = new TestCleanEmpty();
        const testBadReturn = new TestBadReturn();

        expect(function () {
            testEmpty.hasRequired({});
        }).to.throw(Error);

        expect(function () {
            testCleanEmpty.hasRequired({});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.hasRequired({});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.hasRequired({});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.hasRequired([]);
        }).to.throw(Error);

        expect(function () {
            testBadReturn.hasRequired({});
        }).to.throw(Error);

        expect(function () {
            testBadReturn.hasRequired(1);
        }).to.throw(Error);

        expect(function () {
            test.hasRequired({});
        }).to.not.throw();

        assert.isTrue(test.hasRequired({ id: "foobar", time: "now" }));
    });

});

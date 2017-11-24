const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Model = require("../lib/util/model.js");

class TestEmpty extends Model {

}

class TestCleanEmpty extends Model {
    updateExclusion() {
        return [];
    }
}

class TestUpdateEmpty extends Model {
    cleanInclusion() {
        return [];
    }
}

class TestBadReturn extends Model {
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

class Test extends Model {
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

describe('Model', function () {
    it('Test Model instance', function () {
        expect(function () {
            const model = new Model();
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

        const filled = {foo: "bar"};

        const frozenObject = Object.freeze({foo: "bar", bar: "foo"});
        test.update(frozenObject, filled);
        expect(frozenObject).to.be.frozen;

        const extendedFilled = {foo: "bar", bar: "foo", thisisempty: "", thisisnull: null, id: "123546789"};
        const updatedObject = test.update(extendedFilled, {foo: "bar2"});
        assert.notEqual("bar2", updatedObject.foo);
        assert.equal(extendedFilled.thisisnull, updatedObject.updatedObject);
        assert.equal(updatedObject.thisisnull, undefined);
        assert.equal(updatedObject.id, undefined);

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

        const frozenObject = Object.freeze({foo: "bar", bar: "foo", id: "123456789", secret: "thisisasecret"});
        test.clean(frozenObject);
        expect(frozenObject).to.be.frozen;

        const extendedFilled = {foo: "bar", bar: "foo", thisisempty: "", thisisnull: null, id: "123546789"};
        const updatedObject = test.clean(extendedFilled);
        assert.notEqual("bar2", updatedObject.foo);
        assert.equal(extendedFilled.thisisnull, updatedObject.updatedObject);
        assert.equal(updatedObject.thisisnull, null);
        assert.equal(updatedObject.id, undefined);
        assert.equal(updatedObject.secret, undefined);

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
            test.hasRequired({});
        }).to.not.throw();
    });

});

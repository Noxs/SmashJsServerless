const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const DynamodbModel = require("../../lib/util/dynamodbModel.js");

class TestEmpty extends DynamodbModel {
    constructor(table) {
        super(table);
    }
}

describe('DynamodbModel', function () {
    it('Test DynamodbModel instance', function () {
        expect(function () {
            const model = new DynamodbModel();
        }).to.throw(Error);

        expect(function () {
            const testEmpty = new TestEmpty();
        }).to.throw(Error);

        expect(function () {
            const testEmpty = new TestEmpty("testtable");
        }).to.not.throw(Error);
    });

    it('Test DynamodbModel get table ', function () {
        const model = new TestEmpty("testtable");
        assert.equal(model.table, "testtable");
        model.env = "TEST";
        assert.equal(model.table, "testtable_TEST");
        model.env = "dev";
        assert.equal(model.table, "testtable_dev");
    });
});

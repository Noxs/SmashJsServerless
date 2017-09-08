var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var filter = require('../core/filter.js').build();
var databaseSuccess = {
    getInputFilters: function () {
        return ['username', 'created'];
    },
    getOutputFilters: function () {
        return ['password'];
    }
};
var databaseFailure = {
    getInputFilters: "FOOBAR"
};
var createDbData = function () {
    return {
        username: "foo@bar.com",
        password: "foobar",
        roles: "USER"
    };
};
var createExtData = function () {
    return {
        username: "false@bar.com",
        password: "foobar",
        roles: "ADMIN",
        renew: "never",
        test: ""
    };
};
describe('Filter', function () {
    it('Test filter instance', function () {
        assert.isObject(filter);
    });
    it('Test bad input filters', function () {
        //TODO improve
        filter.filterInput({}, {}, databaseFailure);
    });
    it('Test bad output filters', function () {
        //TODO improve
        filter.filterOutput({}, databaseFailure);
    });
    it('Test good input filters', function () {
        var input = filter.filterInput(createDbData(), createExtData(), databaseSuccess);
        assert.equal(input.username, createDbData().username);
        assert.notEqual(input.username, createExtData().username);
        assert.equal(input.roles, createExtData().roles);
        assert.equal(input.renew, createExtData().renew);
        assert.equal(null,input.test);
        var output = filter.filterOutput(createDbData(), databaseSuccess);
        assert.notExists(output.password);
        assert.exists(output.username);
    });
    it('Test good output filters', function () {
        var output = filter.filterOutput(createDbData(), databaseSuccess);
        assert.notExists(output.password);
        assert.exists(output.username);
    });
});

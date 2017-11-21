const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const RouteParameter = require('../lib/core/routeParameter.js');

describe('RouteParameter', function () {
    it('Test RouteParameter build success', function () {
        const parameter = new RouteParameter("test", 0);
        assert.equal(parameter.keyword, "test");
        assert.equal(parameter.position, 0);
    });

    it('Test RouteParameter build failure', function () {
        expect(function () {
            const parameter = new RouteParameter();
        }).to.throw(Error);

        expect(function () {
            const parameter = new RouteParameter({}, {});
        }).to.throw(Error);

        expect(function () {
            const parameter = new RouteParameter("test", {});
        }).to.throw(Error);

        expect(function () {
            const parameter = new RouteParameter({}, 0);
        }).to.throw(Error);
    });
});

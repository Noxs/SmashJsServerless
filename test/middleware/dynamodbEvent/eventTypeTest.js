const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const EventType = require('../../../lib/middleware/dynamodbEvent/lib/eventType.js');

describe('EventType', function () {
    it('Test event instance failure', function () {
        expect(function () {
            const eventType = new EventType();
        }).to.throw(Error);
        const callback = () => { };
        expect(function () {
            const eventType = new EventType(callback);
        }).to.throw(Error);
        const route = { type: "", table: "" };
        expect(function () {
            const eventType = new EventType(route);
        }).to.throw(Error);
    });

    it('Test event instance success', function () {
        const route = { type: "", table: "" };
        const callback = (param) => { };
        expect(function () {
            const eventType = new EventType(route, callback);
        }).to.not.throw(Error);
    });

    it('Test event match success not match', function () {
        const route = { type: "", table: "" };
        const callback = (param) => { };
        const eventType = new EventType(route, callback);
        const event = {};
        assert.isFalse(eventType.match(event));
    });

    it('Test event match success match', function () {
        const route = { type: "INSERT", table: "foobar" };
        const callback = (param) => { };
        const eventType = new EventType(route, callback);
        const event = { type: "INSERT", table: "foobar" };
        assert.isTrue(eventType.match(event));
    });

    it('Test event callback', function () {
        const route = { type: "", table: "" };
        const callback = (param) => { };
        const eventType = new EventType(route, callback);
        assert.isFunction(eventType.callback);
    });
});

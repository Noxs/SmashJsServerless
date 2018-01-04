const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const EventType = require('../../../lib/middleware/cloudWatchEvent/lib/eventType.js');

describe('EventType', function () {
    it('Test event instance failure', function () {
        expect(function () {
            const eventType = new EventType();
        }).to.throw(Error);
        const callback = () => { };
        expect(function () {
            const eventType = new EventType(callback);
        }).to.throw(Error);
        const route = { source: "", version: "" };
        expect(function () {
            const eventType = new EventType(route);
        }).to.throw(Error);
    });

    it('Test event instance success', function () {
        const route = { source: "", version: "" };
        const callback = (param) => { };
        expect(function () {
            const eventType = new EventType(route, callback);
        }).to.not.throw(Error);
    });

    it('Test event match success not match', function () {
        const route = { source: "", version: "" };
        const callback = (param) => { };
        const eventType = new EventType(route, callback);
        const event = {};
        assert.isFalse(eventType.match(event));
    });

    it('Test event match success match', function () {
        const route = { source: "test", version: "1" };
        const callback = (param) => { };
        const eventType = new EventType(route, callback);
        const event = { source: "test", version: "1" };
        assert.isTrue(eventType.match(event));
    });

    it('Test event callback', function () {
        const route = { source: "", version: "" };
        const callback = (param) => { };
        const eventType = new EventType(route, callback);
        assert.isFunction(eventType.callback);
    });
});

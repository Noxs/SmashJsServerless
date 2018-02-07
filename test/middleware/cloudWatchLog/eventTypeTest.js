const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const EventType = require('../../../lib/middleware/CloudWatchLog/lib/eventType.js');

describe('EventType', function () {
    it('Test event instance failure', function () {
        expect(function () {
            const eventType = new EventType();
        }).to.throw(Error);
        const callback = () => { };
        expect(function () {
            const eventType = new EventType(callback);
        }).to.throw(Error);
    });

    it('Test event instance success', function () {
        const callback = (param) => { };
        expect(function () {
            const eventType = new EventType(callback);
        }).to.not.throw(Error);
    });

    it('Test event match success', function () {
        const callback = (param) => { };
        const eventType = new EventType(callback);
        const event = {};
        assert.isTrue(eventType.match(event));
    });

    it('Test event callback', function () {
        const callback = (param) => { };
        const eventType = new EventType(callback);
        assert.isFunction(eventType.callback);
    });
});

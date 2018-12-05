const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const EventType = require('../../../lib/middleware/simpleNotificationService/lib/eventType.js');

describe('EventType', function () {
    it('Test event instance failure', function () {
        expect(function () {
            const eventType = new EventType();
        }).to.throw(Error);
        const callback = () => { };
        expect(function () {
            const eventType = new EventType(callback);
        }).to.throw(Error);
        const notification = {};
        expect(function () {
            const eventType = new EventType(notification);
        }).to.throw(Error);
        notification.channel = "";
        expect(function () {
            const eventType = new EventType(notification);
        }).to.throw(Error);
        const badCallback = () => { };
        expect(function () {
            const eventType = new EventType(notification, badCallback);
        }).to.throw(Error);
    });

    it('Test event instance success', function () {
        const notification = { channel: "foobar" };
        const callback = (param) => { };
        expect(function () {
            const eventType = new EventType(notification, callback);
        }).to.not.throw();
    });

    it('Test event get channel', function () {
        const notification = { channel: "foobar" };
        const callback = (param) => { };
        const eventType = new EventType(notification, callback);
        assert.equal(eventType.channel, "foobar");
    });

    it('Test event match success not match', function () {
        const notification = { channel: "" };
        const callback = (param) => { };
        const eventType = new EventType(notification, callback);
        const event = {};
        assert.isFalse(eventType.match(event));
    });

    it('Test event match success match', function () {
        const notification = { channel: "TestAction" };
        const callback = (param) => { };
        const eventType = new EventType(notification, callback);
        const event = { channel: "TestAction" };
        assert.isTrue(eventType.match(event));
    });

    it('Test event callback', function () {
        const notification = { channel: "" };
        const callback = (param) => { };
        const eventType = new EventType(notification, callback);
        assert.isFunction(eventType.callback);
    });
});

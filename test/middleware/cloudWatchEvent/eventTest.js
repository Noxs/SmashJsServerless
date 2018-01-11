const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Event = require('../../../lib/middleware/cloudWatchEvent/lib/event.js');

describe('Event', function () {
    it('Test event instance failure', function () {
        expect(function () {
            const event = new Event();
        }).to.throw(Error);
        const rawEvent = {};
        expect(function () {
            const event = new Event(rawEvent);
        }).to.throw(Error);
        const context = {};
        const terminateObject = {};
        expect(function () {
            const event = new Event(rawEvent, context, terminateObject);
        }).to.throw(Error);
        const terminate = () => { };
        expect(function () {
            const event = new Event(rawEvent, context, terminate);
        }).to.throw(Error);
    });

    it('Test event instance success', function () {
        const rawEvent = {};
        const context = {};
        const terminate = { terminate: (error, data) => { } };
        expect(function () {
            const event = new Event(rawEvent, context, terminate);
        }).to.not.throw(Error);
    });

    it('Test event success', function () {
        const rawEvent = {};
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.success();
        assert.isTrue(spy.called);
    });

    it('Test event failure', function () {
        const rawEvent = {};
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.failure(new Error("Foobar"));
        assert.isTrue(spy.called);
    });

    it('Test event terminate', function () {
        const rawEvent = {};
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.terminate(null);
        assert.isTrue(spy.called);
    });
});


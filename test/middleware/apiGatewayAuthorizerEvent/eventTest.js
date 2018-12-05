const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Event = require('../../../lib/middleware/apiGatewayAuthorizerEvent/lib/event.js');

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
        const terminate = { terminate: () => { } };
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

    it('Test event internal server error', function () {
        const rawEvent = {};
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.internalServerError();
        assert.isTrue(spy.called);
    });

    it('Test event unauthorized', function () {
        const rawEvent = {};
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.unauthorized();
        assert.isTrue(spy.called);
    });

    it('Test event invalidToken', function () {
        const rawEvent = {};
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.invalidToken();
        assert.isTrue(spy.called);
    });

    it('Test event allow', function () {
        const rawEvent = { methodArn: "arn:aws:lambda:eu-west-1:xxxxxxxxxxxx:function:xxxxxxxxxx" };
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.allow();
        assert.isTrue(spy.called);
    });

    it('Test event deny', function () {
        const rawEvent = {};
        const context = {};
        const spy = sinon.spy();
        const terminate = {
            terminate: (error, data) => {
                spy();
            }
        };
        const event = new Event(rawEvent, context, terminate);
        event.deny();
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


const EventType = require('../../../../lib/middleware/apiGatewayProxyWebsocket/lib/eventType.js');

describe('EventType', () => {
	it('Test event instance failure', () => {
		expect(() => new EventType()).toThrow();
		const callback = () => { };
		expect(() => new EventType(callback)).toThrow();
		const notification = {};
		expect(() => new EventType(notification)).toThrow();
		notification.channel = "";
		expect(() => new EventType(notification)).toThrow();
		const badCallback = () => { };
		expect(() => new EventType(notification, badCallback)).toThrow();
	});

    /*it('Test event instance success', function () {
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
    }); */
});

const WebSocket = require('../../../../lib/middleware/apiGatewayProxyWebsocket/lib/webSocket');

describe('EventType', () => {
	it('WebSocket instance failure', () => {
		expect(() => new WebSocket()).toThrow();
	});
});

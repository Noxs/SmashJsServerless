const Event = require('../../../lib/middleware/apiGatewayProxyWebsocket/lib/event.js');

describe('Event', function () {
    /*     it('Test event instance failure', function () {
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
        }); */

    /* it('Test event instance success', function () {
        const rawEvent = { Records: [{ EventSubscriptionArn: 'arn:aws:sns:xx-xxxx-x:xxxxxxxxxxxxx:xxxxxxxxxxxxxxx-ActionTest-env-one-region-x:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', Sns: { Type: "Notification", Subject: "Test subject", Message: "testProperty=\'this is a string\'" } }] };
        const context = {};
        const terminate = { terminate: (error, data) => { } };
        expect(function () {
            const event = new Event(rawEvent, context, terminate);
        }).to.not.throw(Error);
    });

    it('Test event success', function () {
        const rawEvent = { Records: [{ EventSubscriptionArn: 'arn:aws:sns:xx-xxxx-x:xxxxxxxxxxxxx:xxxxxxxxxxxxxxx-ActionTest-env-one-region-x:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', Sns: { Type: "Notification", Subject: "Test subject", Message: "{\"testProperty\":\"this is a string\"}" } }] };
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
        const rawEvent = { Records: [{ EventSubscriptionArn: 'arn:aws:sns:xx-xxxx-x:xxxxxxxxxxxxx:xxxxxxxxxxxxxxx-ActionTest-env-one-region-x:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', Sns: { Type: "Notification", Subject: "Test subject", Message: "testProperty=\'{\"testJSONProperty\":\"this is a string\"}\'" } }] };
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
        const rawEvent = { Records: [{ EventSubscriptionArn: 'arn:aws:sns:xx-xxxx-x:xxxxxxxxxxxxx:xxxxxxxxxxxxxxx-ActionTest-env-one-region-x:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', Sns: { Type: "Notification", Subject: "Test subject", Message: "testProperty=null" } }] };
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

    it('Test event parsing', function () {
        const rawEvent = { Records: [{ EventSubscriptionArn: 'arn:aws:sns:xx-xxxx-x:xxxxxxxxxxxxx:xxxxxxxxxxxxxxx-ActionTest-env-one-region-x:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', Sns: { Type: "Notification", Subject: "Test subject", Message: 'testProperty=\'{\"testJSONProperty\":\"this is a string\"}\'\ntestProperty1=\'Foobar\'' } }] };
        const context = {};
        const terminate = { terminate: (error, data) => { } };
        const event = new Event(rawEvent, context, terminate);
        const message = {
            testProperty: {
                testJSONProperty: 'this is a string'
            },
            testProperty1: 'Foobar'
        };
        assert.deepEqual(event.message, message);
    });

    it('Test event parsing invalid', function () {
        const rawEvent = { Records: [{ EventSubscriptionArn: 'arn:aws:sns:xx-xxxx-x:xxxxxxxxxxxxx:xxxxxxxxxxxxxxx-ActionTest-env-one-region-x:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', Sns: { Type: "Notification", Subject: "Test subject", Message: 'testProperty=' } }] };
        const context = {};
        const terminate = { terminate: (error, data) => { } };
        expect(function () {
            const event = new Event(rawEvent, context, terminate);
        }).to.throw(Error);
    }); */
});




const event1 =
{
    headers:
    {
        Authorization: 'Anonymous',
        Host: "xxxxxxxxxxxxxxxxxx",
        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
        'Sec-WebSocket-Key': 'xxxxxxxxxxxxx',
        'Sec-WebSocket-Version': '13',
        'X-Amzn-Trace-Id': 'xxxxxxxxxxxxxxxxxxx',
        'X-Forwarded-For': 'xx.xx.xx.xx',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders:
    {
        Authorization: ['xxxxxxxxxxxxxxxxxxxx'],
        Host: ['xxxxxxxxxxxxxxxxxxxx'],
        'Sec-WebSocket-Extensions': ['permessage-deflate; client_max_window_bits'],
        'Sec-WebSocket-Key': ['xxxxxxxxxxxxxxxxxxxxxxx'],
        'Sec-WebSocket-Version': ['13'],
        'X-Amzn-Trace-Id': ['xxxxxxxxxxxxxxxxxxxx'],
        'X-Forwarded-For': ["xx.xx.xx.xx"],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    requestContext:
    {
        routeKey: '$connect',
        messageId: null,
        eventType: 'CONNECT',
        extendedRequestId: 'xxxxxxxxxxxxxx',
        requestTime: '17/Jul/2019:09:04:17 +0000',
        messageDirection: 'IN',
        stage: 'xxx',
        connectedAt: 1563354257606,
        requestTimeEpoch: 1563354257607,
        identity:
        {
            cognitoIdentityPoolId: null,
            cognitoIdentityId: null,
            principalOrgId: null,
            cognitoAuthenticationType: null,
            userArn: null,
            userAgent: null,
            accountId: null,
            caller: null,
            sourceIp: 'xx.xx.xxx.xx',
            accessKey: null,
            cognitoAuthenticationProvider: null,
            user: null
        },
        requestId: 'xxxxxxxxxxxxxxxxx',
        domainName: 'xxxxxxxxxxxxxxxxxxxxx',
        connectionId: 'xxxxxxxxxxxxxxx',
        apiId: 'xxxxxxxxxxxxxxxxx'
    },
    isBase64Encoded: false
};


const event2 =
{
    headers:
    {
        Authorization: 'Anonymous',
        Host: "xxxxxxxxxxxxxxxxxx",
        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
        'Sec-WebSocket-Key': 'xxxxxxxxxxxxx',
        'Sec-WebSocket-Version': '13',
        'X-Amzn-Trace-Id': 'xxxxxxxxxxxxxxxxxxx',
        'X-Forwarded-For': 'xx.xx.xx.xx',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders:
    {
        Authorization: ['xxxxxxxxxxxxxxxxxxxx'],
        Host: ['xxxxxxxxxxxxxxxxxxxx'],
        'Sec-WebSocket-Extensions': ['permessage-deflate; client_max_window_bits'],
        'Sec-WebSocket-Key': ['xxxxxxxxxxxxxxxxxxxxxxx'],
        'Sec-WebSocket-Version': ['13'],
        'X-Amzn-Trace-Id': ['xxxxxxxxxxxxxxxxxxxx'],
        'X-Forwarded-For': ["xx.xx.xx.xx"],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    requestContext:
    {
        routeKey: '$diqconnect',
        messageId: null,
        eventType: 'DISCONNECT',
        extendedRequestId: 'xxxxxxxxxxxxxx',
        requestTime: '17/Jul/2019:09:04:17 +0000',
        messageDirection: 'IN',
        stage: 'xxx',
        connectedAt: 1563354257606,
        requestTimeEpoch: 1563354257607,
        identity:
        {
            cognitoIdentityPoolId: null,
            cognitoIdentityId: null,
            principalOrgId: null,
            cognitoAuthenticationType: null,
            userArn: null,
            userAgent: null,
            accountId: null,
            caller: null,
            sourceIp: 'xx.xx.xxx.xx',
            accessKey: null,
            cognitoAuthenticationProvider: null,
            user: null
        },
        requestId: 'xxxxxxxxxxxxxxxxx',
        domainName: 'xxxxxxxxxxxxxxxxxxxxx',
        connectionId: 'xxxxxxxxxxxxxxx',
        apiId: 'xxxxxxxxxxxxxxxxx'
    },
    isBase64Encoded: false
};

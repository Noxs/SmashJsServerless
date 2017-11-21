const smash = require('../smash.js');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const ApiGatewayProxy = require('../lib/middleware/apiGatewayProxy.js');


const lambdaEventSuccess = {
    "body": "{\"test\":\"body\"}",
    "resource": "/{proxy+}",
    "requestContext": {
        "resourceId": "123456",
        "apiId": "1234567890",
        "resourcePath": "/{proxy+}",
        "httpMethod": "POST",
        "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
        "accountId": "123456789012",
        "identity": {
            "apiKey": null,
            "userArn": null,
            "cognitoAuthenticationType": null,
            "caller": null,
            "userAgent": "Custom User Agent String",
            "user": null,
            "cognitoIdentityPoolId": null,
            "cognitoIdentityId": null,
            "cognitoAuthenticationProvider": null,
            "sourceIp": "127.0.0.1",
            "accountId": null
        },
        "authorizer": {
            "username": "test@test.com"
        },
        "stage": "prod"
    },
    "queryStringParameters": {
        "in": "/signupfree",
        "out": "/domain",
        "source": "fubiz"
    },
    "headers": {
        "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
        "Accept-Language": "en-US,en;q=0.8",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Mobile-Viewer": "false",
        "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
        "CloudFront-Viewer-Country": "US",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Upgrade-Insecure-Requests": "1",
        "X-Forwarded-Port": "443",
        "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
        "X-Forwarded-Proto": "https",
        "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
        "CloudFront-Is-Tablet-Viewer": "false",
        "Cache-Control": "max-age=0",
        "User-Agent": "Custom User Agent String",
        "CloudFront-Forwarded-Proto": "https",
        "Accept-Encoding": "gzip, deflate, sdch"
    },
    "pathParameters": {
        "proxy": "path/to/resource"
    },
    "httpMethod": "GET",
    "stageVariables": {
        "baz": "qux"
    },
    "path": "/statistics/navigation/path/conversion"
};


const lambdaEventFailure = {
    "source": "not ApiGateway event"
};

describe('ApiGatewayProxy', function () {

    beforeEach(function () {
        smash.boot();
    });

    it('Test ApiGatewayProxy instance success', function () {
        expect(function () {
            const apiGatewayProxy = new ApiGatewayProxy();
        }).to.not.throw(Error);

        const apiGatewayProxy = new ApiGatewayProxy();
        assert.isFunction(apiGatewayProxy.router.next);
        assert.isFunction(apiGatewayProxy.userProvider.next);
        assert.isFunction(apiGatewayProxy.authorization.next);
    });

    it('Test handle event success', function () {
        const apiGatewayProxy = new ApiGatewayProxy();

        const terminate = sinon.spy();
        apiGatewayProxy.handleEvent(lambdaEventSuccess, terminate);

    });

    it('Test handle event failure', function () {
        const apiGatewayProxy = new ApiGatewayProxy();

        expect(function () {
            apiGatewayProxy.handleEvent(lambdaEventSuccess);
        }).to.throw(Error);

        const terminate = sinon.spy();
        apiGatewayProxy.handleEvent("", terminate);

        assert.isOk(terminate.called);
    });

    it('Test handle request success', function () {
        //TODO
    });

    it('Test handle request failure', function () {
        //TODO
    });

    it('Test handle response success', function () {
        const apiGatewayProxy = new ApiGatewayProxy();

        apiGatewayProxy._callback = sinon.spy();
        expect(function () {
            apiGatewayProxy.handleResponse({code: "200", headers: {}, stringifiedBody: "fooBar"});
        }).to.not.throw(Error);
        assert.isOk(apiGatewayProxy._callback.called);
    });

    it('Test handle response failure', function () {
        const apiGatewayProxy = new ApiGatewayProxy();

        apiGatewayProxy._callback = sinon.spy();
        expect(function () {
            apiGatewayProxy.handleResponse({});
        }).to.not.throw(Error);
        assert.isOk(apiGatewayProxy._callback.called);

        expect(function () {
            apiGatewayProxy.handleResponse();
        }).to.throw(Error);
        assert.isOk(apiGatewayProxy._callback.called);
    });

    it('Test isEvent() true', function () {
        const apiGatewayProxy = new ApiGatewayProxy();
        expect(function () {
            assert.equal(apiGatewayProxy.isEvent(lambdaEventSuccess), true);
        }).to.not.throw(Error);
    });

    it('Test isEvent() false', function () {
        const apiGatewayProxy = new ApiGatewayProxy();

        expect(function () {
            assert.equal(apiGatewayProxy.isEvent(""), false);
        }).to.not.throw(Error);

        expect(function () {
            assert.equal(apiGatewayProxy.isEvent(lambdaEventFailure), false);
        }).to.not.throw(Error);
    });
});

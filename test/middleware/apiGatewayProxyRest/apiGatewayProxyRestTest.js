const smash = require('../../../smash');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const ApiGatewayProxyRest = require('../../../lib/middleware/apiGatewayProxyRest/apiGatewayProxyRest');

const lambdaEventSuccess = {
    "body": "{\"test\":\"body\"}",
    "resource": "/{proxy+}",
    "requestContext": {
        "resourceId": "123456",
        "apiId": "1234567890",
        "resourcePath": "/{proxy+}",
        "httpMethod": "POST",
        "requestId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
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
        "Via": "1.1 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.cloudfront.net (CloudFront)",
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
        "X-Amz-Cf-Id": "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
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

describe('apiGatewayProxyRest', function () {

    beforeEach(function () {
        smash.boot();
    });

    it('Test apiGatewayProxyRest instance success', function () {
        expect(function () {
            const apiGatewayProxyRest = new ApiGatewayProxyRest();
        }).to.not.throw(Error);

        const apiGatewayProxyRest = new ApiGatewayProxyRest();
        assert.isFunction(apiGatewayProxyRest.router.next);
    });

    it('Test handle event success', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();

        const terminate = sinon.spy();
        apiGatewayProxyRest.handleEvent(lambdaEventSuccess, {}, terminate);
        assert.isOk(terminate.called);
    });

    it('Test handle event failure', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();

        expect(function () {
            apiGatewayProxyRest.handleEvent(lambdaEventSuccess);
        }).to.throw(Error);

        const terminate = sinon.spy();
        apiGatewayProxyRest.handleEvent("", {}, terminate);

        assert.isOk(terminate.called);
    });

    it('Test handle request success', function () {
        //TODO
    });

    it('Test handle request failure', function () {
        //TODO
    });

    it('Test handle response success', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();

        apiGatewayProxyRest._callback = sinon.spy();
        expect(function () {
            apiGatewayProxyRest.handleResponse({ code: "200", headers: {}, stringifiedBody: "fooBar" });
        }).to.not.throw(Error);
        assert.isOk(apiGatewayProxyRest._callback.called);
    });

    it('Test handle response failure', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();

        apiGatewayProxyRest._callback = sinon.spy();
        expect(function () {
            apiGatewayProxyRest.handleResponse({});
        }).to.not.throw(Error);
        assert.isOk(apiGatewayProxyRest._callback.called);

        expect(function () {
            apiGatewayProxyRest.handleResponse();
        }).to.throw(Error);
        assert.isOk(apiGatewayProxyRest._callback.called);
    });

    it('Test isEvent() true', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();
        expect(function () {
            assert.equal(apiGatewayProxyRest.isEvent(lambdaEventSuccess), true);
        }).to.not.throw(Error);
    });

    it('Test isEvent() false', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();

        expect(function () {
            assert.equal(apiGatewayProxyRest.isEvent(""), false);
        }).to.not.throw(Error);

        expect(function () {
            assert.equal(apiGatewayProxyRest.isEvent(lambdaEventFailure), false);
        }).to.not.throw(Error);
    });
});

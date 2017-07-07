var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var sinon = require('sinon');
var lambdaProxyRequest = require('../middleware/lambdaProxyRequest.js');
var lambdaEvent = {
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
var notLambdaEvent = {};
function createNext() {
    return sinon.spy();
}
function createFail() {
    return sinon.spy();
}
describe('LambdaProxyRequest', function () {
    it('Test lambda proxy request instance', function () {
        assert.isObject(lambdaProxyRequest);
    });
    it('Test lambda proxy request handling', function () {
        var fail = createFail();
        lambdaProxyRequest.setNext(function (request, response) {
            assert.equal(request.method, lambdaEvent.httpMethod);
            assert.equal(request.queryParamters, lambdaEvent.queryStringParameters);
            assert.equal(request.headers, lambdaEvent.headers);
            assert.equal(request.path, lambdaEvent.path);
            assert.deepEqual(request.body, JSON.parse(lambdaEvent.body));
        }, fail);
        var result = lambdaProxyRequest.handleRequest(lambdaEvent);
        assert.isTrue(result);
        assert.isOk(fail.notCalled);

        fail = createFail();
        lambdaEvent.requestContext.authorizer = {
            "username": "test@test.com"
        };
        lambdaProxyRequest.setNext(function (request, response) {
            assert.equal(request.method, lambdaEvent.httpMethod);
            assert.equal(request.queryParamters, lambdaEvent.queryStringParameters);
            assert.equal(request.headers, lambdaEvent.headers);
            assert.equal(request.path, lambdaEvent.path);
            assert.deepEqual(request.body, JSON.parse(lambdaEvent.body));
            assert.equal(request.user.username, lambdaEvent.requestContext.authorizer.username);
        }, fail);
        result = lambdaProxyRequest.handleRequest(lambdaEvent);
        assert.isTrue(result);
        assert.isOk(fail.notCalled);

    });
    it('Test lambda not proxy request handling', function () {
        var next = createNext();
        var fail = createFail();
        lambdaProxyRequest.setNext(next, fail);
        var result = lambdaProxyRequest.handleRequest(notLambdaEvent);
        assert.isFalse(result);
        assert.isOk(next.notCalled);
        assert.isOk(fail.called);
    });
    //TODO test when no request context, no username
});

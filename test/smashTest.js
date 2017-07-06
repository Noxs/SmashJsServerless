var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var smash = require('../smash.js');
var lambdaProxyRequest = require('../middleware/lambdaProxyRequest.js');
var lambdaProxyResponse = require('../middleware/lambdaProxyResponse.js');
var createFakeLambdaProxyRequest = function () {
    var that = this;
    that.next = null;
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        handleRequest: function (request, response) {

        }
    };
};
//TODO improve
var createFakeLogger = function () {
    var that = this;
    that.next = null;
    return {
        log: function () {},
        warn: function () {},
        error: function () {}
    };
};
var createFakeUserProvider = function () {
    var that = this;
    that.next = null;
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        handleResponse: function (response) {

        }
    };
};
var createFakeRouter = function () {
    var that = this;
    that.next = null;
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        handleResponse: function (response) {

        }
    };
};
var createFakeAuthorization = function () {
    var that = this;
    that.next = null;
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        handleResponse: function (response) {

        }
    };
};
var createFakeConfig = function () {
    var that = this;
    that.next = null;
    return {
        load: function () {}
    };
};
var createFakeLambdaProxyResponse = function () {
    var that = this;
    that.next = null;
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        handleResponse: function (response) {

        }
    };
};
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
describe('Smash', function () {
    it('Test register user provider', function () {
        var userProvider = {"test": "test"};
        smash.registerUserProvider(userProvider);
        assert.equal(smash.getUserProvider(), userProvider);
    });
    it('Test register router', function () {
        var router = {"test": "test"};
        smash.registerRouter(router);
        assert.equal(smash.getRouter(), router);
    });
    it('Test register logger', function () {
        var logger = {"test": "test"};
        smash.registerLogger(logger);
        assert.equal(smash.getLogger(), logger);
    });
    it('Test register authorization', function () {
        var authorization = {"test": "test"};
        smash.registerAuthorization(authorization);
        assert.equal(smash.getAuthorization(), authorization);
    });
    it('Test register config', function () {
        var oldConfig = smash.getConfig();
        var smashConfig = {"test": "test"};
        smash.registerConfig(smashConfig);
        assert.equal(smash.getConfig(), smashConfig);
        smash.registerConfig(oldConfig);
        assert.equal(smash.getConfig(), oldConfig);
    });
    it('Test smash instance', function () {
        smash.resetRootPath();
        smash.boot();
        assert.isObject(smash);
        assert.isObject(smash.getLogger());
        assert.isObject(smash.getRouter());
        assert.isObject(smash.getAuthorization());
        assert.isObject(smash.getConfig());
        assert.isObject(smash.getUserProvider());
    });
    it('Test smash debug', function () {
        smash.resetRootPath();
        smash.boot(true);
        assert.equal(smash.debugIsActive(), true);
        smash.resetRootPath();
        smash.boot(false);
        assert.equal(smash.debugIsActive(), false);
        smash.resetRootPath();
        smash.boot();
        assert.equal(smash.debugIsActive(), false);
    });
    it('Test smash env', function () {

    });
    it('Test smash root path', function () {
        assert.equal(smash.getRootPath(), process.cwd());
        smash.setRootPath("/PATH/TEST");
        assert.equal(smash.getRootPath(), "/PATH/TEST");
    });
    it('Test smash controller path', function () {
        assert.equal(smash.getControllerPath(), "/controller/*.js");
        smash.setControllerPath("/PATH/TEST");
        assert.equal(smash.getControllerPath(), "/PATH/TEST");
    });
    it('Test boot', function () {
        smash.resetRootPath();
        expect(smash.boot).to.not.throw();
    });
    it('Test register request middleware', function () {
        var fakeLambdaProxyRequest = createFakeLambdaProxyRequest();
        smash.registerRequestMiddleware(fakeLambdaProxyRequest)
        //TODO
        //reactivate when refactor
        //assert.isObject(smash.registerRequestMiddleware(fakeLambdaProxyRequest));
        assert.deepEqual(smash.getRequestMiddleware(), fakeLambdaProxyRequest);
    });
    it('Test register config', function () {
        var fakeConfig = createFakeConfig();
        smash.registerConfig(fakeConfig)
        //assert.isObject(smash.registerConfig(fakeConfig));
        assert.deepEqual(smash.getConfig(), fakeConfig);
    });
    it('Test register user provider', function () {
        var fakeUserProvider = createFakeUserProvider();
        smash.registerUserProvider(fakeUserProvider)
        //assert.isObject(smash.registerUserProvider(fakeUserProvider));
        assert.deepEqual(smash.getUserProvider(), fakeUserProvider);
    });
    it('Test register logger', function () {
        var fakeLogger = createFakeLogger();
        smash.registerLogger(fakeLogger)
        //assert.isObject(smash.registerLogger(fakeLogger));
        assert.deepEqual(smash.getLogger(), fakeLogger);
    });
    it('Test register router', function () {
        var fakeRouter = createFakeRouter();
        smash.registerRouter(fakeRouter)
        //assert.isObject(smash.registerRouter(fakeRouter));
        assert.deepEqual(smash.getRouter(), fakeRouter);
    });
    it('Test register authorization', function () {
        var fakeAuthorization = createFakeAuthorization();
        smash.registerAuthorization(fakeAuthorization)
        //assert.isObject(smash.registerAuthorization(fakeAuthorization));
        assert.deepEqual(smash.getAuthorization(), fakeAuthorization);
    });
    it('Test register response middleware', function () {
        var fakeLambdaProxyResponse = createFakeLambdaProxyResponse();
        smash.registerResponseMiddleware(fakeLambdaProxyResponse)
        //assert.isObject(smash.registerResponseMiddleware(fakeLambdaProxyResponse));
        assert.deepEqual(smash.getResponseMiddleware(), fakeLambdaProxyResponse);
    });
    it('Test register controllers', function () {
        //TODO
    });
    it('Test request', function () {
        var fakeLambdaProxyRequest = createFakeLambdaProxyRequest();
        var fakeLogger = createFakeLogger();
        var fakeRouter = createFakeRouter();
        var fakeConfig = createFakeConfig();
        var fakeUserProvider = createFakeUserProvider();
        var fakeAuthorization = createFakeAuthorization();
        var fakeLambdaProxyResponse = createFakeLambdaProxyResponse();
        smash.resetRootPath();
        smash.registerRequestMiddleware(fakeLambdaProxyRequest);
        smash.registerResponseMiddleware(fakeLambdaProxyResponse);
        smash.boot(true);
        smash.registerLogger(fakeLogger);
        smash.registerConfig(fakeConfig);
        smash.registerRouter(fakeRouter);
        smash.registerAuthorization(fakeAuthorization);
        smash.registerUserProvider(fakeUserProvider);
        smash.handleRequest(lambdaEvent, function (err, response) {
            assert.isNull(err);
            assert.isObject(response);
        });

        //TODO improve test 
        //add case
    });
});

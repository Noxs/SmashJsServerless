var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var smash = require('../smash.js');
var lambdaProxyRequest = require('../middleware/lambdaProxyRequest.js').build();
var lambdaProxyResponse = require('../middleware/lambdaProxyResponse.js').build();
var authorization = require('../core/authorization.js').build();
var realConfig = require('../core/config.js').build();
var realLogger = require('../core/logger.js').build();
var router = require('../core/router.js').build();
var userProvider = require('../core/userProvider.js').build();
function logger() {
    var that = this;
    that.log = function () {};
    that.warn = function () {};
    that.error = function () {};
}
function serviceRequestSuccess() {
    var that = this;
    var next = null;
    var fail = null;
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.handleRequest = function (request, response) {
        next(request, response);
        return true;
    };
}
function serviceRequestFailure() {
    var that = this;
    var next = null;
    var fail = null;
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.handleRequest = function (request, response) {
        response.badRequest();
        fail(response);
        return false;
    };
}
function config() {
    var that = this;
    that.load = function () {};
}

function serviceResponseSuccess() {
    var that = this;
    var next = null;
    var fail = null;
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.handleResponse = function (response) {
        next(null, response);
    };
}

function serviceResponseFailure() {
    var that = this;
    var next = null;
    var fail = null;
    that.setNext = function (extNext, extFail) {
        next = extNext;
        fail = extFail;
        return that;
    };
    that.handleResponse = function (response) {
        fail(response);
    };
}

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
    "path": "/test"
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
        smash.registerLogger(null);
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
        smash.registerLogger(null);
        smash.boot(true);
        smash.registerLogger(null);
        assert.equal(smash.debugIsActive(), false);

        smash.resetRootPath();
        smash.registerLogger(new logger());
        smash.boot(true);
        assert.equal(smash.debugIsActive(), true);

        smash.resetRootPath();
        smash.boot(true);
        smash.registerLogger(new logger());
        assert.equal(smash.debugIsActive(), true);

        smash.resetRootPath();
        smash.boot(false);
        smash.registerLogger(null);
        assert.equal(smash.debugIsActive(), false);

        smash.resetRootPath();
        smash.boot();
        smash.registerLogger(null);
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
        assert.equal(smash.getControllerPath(), "controller\\*.js");
        smash.setControllerPath("/PATH/TEST");
        assert.equal(smash.getControllerPath(), "/PATH/TEST");
    });
    it('Test boot', function () {
        smash.resetRootPath();
        expect(smash.boot).to.not.throw();
        smash.registerLogger(null);
        expect(smash.boot).to.not.throw();
        smash.registerRouter(null);
        expect(smash.boot).to.not.throw();
        smash.registerAuthorization(null);
        expect(smash.boot).to.not.throw();
        smash.registerUserProvider(null);
        expect(smash.boot).to.not.throw();
    });
    it('Test register request middleware', function () {
        var fakeLambdaProxyRequest = new serviceRequestSuccess();
        smash.registerRequestMiddleware(fakeLambdaProxyRequest);
        assert.isObject(smash.registerRequestMiddleware(fakeLambdaProxyRequest));
        assert.deepEqual(smash.getRequestMiddleware(), fakeLambdaProxyRequest);
    });
    it('Test register config', function () {
        var fakeConfig = new config();
        smash.registerConfig(fakeConfig);
        assert.isObject(smash.registerConfig(fakeConfig));
        assert.deepEqual(smash.getConfig(), fakeConfig);
    });
    it('Test register user provider', function () {
        var fakeUserProvider = new serviceRequestSuccess();
        smash.registerUserProvider(fakeUserProvider);
        assert.isObject(smash.registerUserProvider(fakeUserProvider));
        assert.deepEqual(smash.getUserProvider(), fakeUserProvider);
    });
    it('Test register logger', function () {
        var fakeLogger = new logger();
        smash.registerLogger(fakeLogger);
        assert.isObject(smash.registerLogger(fakeLogger));
        assert.deepEqual(smash.getLogger(), fakeLogger);
    });
    it('Test register router', function () {
        var fakeRouter = new serviceRequestSuccess();
        smash.registerRouter(fakeRouter);
        assert.isObject(smash.registerRouter(fakeRouter));
        assert.deepEqual(smash.getRouter(), fakeRouter);
    });
    it('Test register authorization', function () {
        var fakeAuthorization = new serviceRequestSuccess();
        smash.registerAuthorization(fakeAuthorization);
        assert.isObject(smash.registerAuthorization(fakeAuthorization));
        assert.deepEqual(smash.getAuthorization(), fakeAuthorization);
    });
    it('Test register response middleware', function () {
        var fakeLambdaProxyResponse = new serviceResponseSuccess();
        smash.registerResponseMiddleware(fakeLambdaProxyResponse);
        assert.isObject(smash.registerResponseMiddleware(fakeLambdaProxyResponse));
        assert.deepEqual(smash.getResponseMiddleware(), fakeLambdaProxyResponse);
    });
    it('Test register controllers', function () {
        //TODO
    });
    it('Test request with controller execution not found', function () {
        smash.resetRootPath();
        smash.registerRequestMiddleware(new serviceRequestSuccess());
        smash.registerResponseMiddleware(new serviceResponseSuccess());
        smash.registerLogger(new logger());
        smash.registerConfig(new config());
        smash.registerRouter(router);
        smash.registerAuthorization(new serviceRequestSuccess());
        smash.registerUserProvider(new serviceRequestSuccess());
        smash.boot(true);
        smash.handleRequest(lambdaEvent, function (err, response) {
            assert.isNull(err);
            assert.isObject(response);
            assert.equal(response.getCode(), 404);
        });
    });
    it('Test request with controller execution ok', function () {
        smash.resetRootPath();
        smash.registerRequestMiddleware(null);
        smash.registerRequestMiddleware(require('../middleware/lambdaProxyRequest.js').build());
        smash.registerResponseMiddleware(new serviceResponseSuccess());
        smash.registerLogger(new logger());
        smash.registerConfig(new config());
        smash.registerRouter(require('../core/router.js').build());
        smash.registerAuthorization(new serviceRequestSuccess());
        smash.registerUserProvider(new serviceRequestSuccess());
        smash.boot(true);
        smash.get({path: "/test"}, function (request, response) {
            response.ok({foo: "bar"});
        });
        smash.handleRequest(lambdaEvent, function (err, response) {
            assert.isNull(err);
            assert.isObject(response);
            assert.equal(response.getCode(), 200);
        });
    });
    it('Test request with controller execution error', function () {
        var fakeLambdaProxyRequest = new serviceRequestSuccess();
        var fakeLogger = new logger();
        var fakeRouter = new serviceRequestSuccess();
        var fakeConfig = new config();
        var fakeUserProvider = new serviceRequestSuccess();
        var fakeAuthorization = new serviceRequestSuccess();
        var fakeLambdaProxyResponse = new serviceResponseSuccess();
        smash.resetRootPath();
        smash.registerRequestMiddleware(fakeLambdaProxyRequest);
        smash.registerResponseMiddleware(fakeLambdaProxyResponse);
        smash.registerLogger(fakeLogger);
        smash.registerConfig(fakeConfig);
        smash.registerRouter(fakeRouter);
        smash.registerAuthorization(fakeAuthorization);
        smash.registerUserProvider(fakeUserProvider);
        smash.boot(true);
        smash.handleRequest(lambdaEvent, function (err, response) {
            assert.isNull(err);
            assert.isObject(response);
            assert.equal(response.getCode(), 500);
        });

        //TODO improve test 
        //add case
    });
    it('Test request without controller execution and error before controller execution', function () {
        var fakeLambdaProxyRequest = new serviceRequestFailure();
        var fakeLogger = new logger();
        var fakeRouter = new serviceRequestSuccess();
        var fakeConfig = new config();
        var fakeUserProvider = new serviceRequestSuccess();
        var fakeAuthorization = new serviceRequestSuccess();
        var fakeLambdaProxyResponse = new serviceResponseSuccess();
        smash.resetRootPath();
        smash.registerRequestMiddleware(fakeLambdaProxyRequest);
        smash.registerResponseMiddleware(fakeLambdaProxyResponse);
        smash.registerLogger(fakeLogger);
        smash.registerConfig(fakeConfig);
        smash.registerRouter(fakeRouter);
        smash.registerAuthorization(fakeAuthorization);
        smash.registerUserProvider(fakeUserProvider);
        smash.boot(true);
        smash.handleRequest(lambdaEvent, function (err, response) {
            assert.isNull(err);
            assert.equal(response.getCode(), 400);
        });

        //TODO improve test 
        //add case
    });

    //TODO test loading controller
});

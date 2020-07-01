const SmashLogger = require('../../../lib/util/smashLogger');
SmashLogger.verbose({ level: "disable" });
const smash = require('../../../smash');
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
			"accountId": null,
		},
		"authorizer": {
			"username": "test@test.com",
		},
		"stage": "prod",
	},
	"queryStringParameters": {
		"in": "/signupfree",
		"out": "/domain",
		"source": "fubiz",
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
		"Accept-Encoding": "gzip, deflate, sdch",
		"Content-Type": "application/json",
	},
	"pathParameters": {
		"proxy": "path/to/resource",
	},
	"httpMethod": "GET",
	"stageVariables": {
		"baz": "qux",
	},
	"path": "/statistics/navigation/path/conversion",
};


const lambdaEventFailure = {
	"source": "not ApiGateway event",
};

describe('apiGatewayProxyRest', () => {
	beforeEach(() => {
		smash.boot({ verbose: { level: "disable" } });
	});

	it('Test apiGatewayProxyRest instance success', () => {
		expect(() => new ApiGatewayProxyRest()).not.toThrow();
	});

	it('Test handle event success', done => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		const terminate = jest.fn(() => {
			expect(terminate.mock.calls.length).toBe(1);
			done();
		});
		apiGatewayProxyRest.handleEvent(lambdaEventSuccess, {}, terminate);
	});

	it('Test handle event failure', done => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		expect(() => apiGatewayProxyRest.handleEvent(lambdaEventSuccess)).toThrow();
		const terminate = jest.fn(() => {
			expect(terminate.mock.calls.length).toBe(1);
			done();
		});
		apiGatewayProxyRest.handleEvent("", {}, terminate);
	});

	it('Test handle request success', () => {
		//TODO
	});

	it('Test handle request failure', () => {
		//TODO
	});

	it('Test handle response success', done => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		apiGatewayProxyRest._callback = jest.fn(() => {
			expect(apiGatewayProxyRest._callback.mock.calls.length).toBe(1);
			done();
		});
		expect(() => apiGatewayProxyRest.handleResponse({ code: "200", headers: {}, stringifiedBody: "fooBar" })).not.toThrow();
	});

	it('Test handle response failure', done => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		apiGatewayProxyRest._callback = jest.fn(() => {
			expect(apiGatewayProxyRest._callback.mock.calls.length).toBe(1);
			done();
		});
		expect(() => apiGatewayProxyRest.handleResponse({})).not.toThrow();
		expect(() => apiGatewayProxyRest.handleResponse()).toThrow();
	});

	it('Test isEvent() true', () => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		expect(apiGatewayProxyRest.isEvent(lambdaEventSuccess)).toBeTrue();
	});

	it('Test isEvent() false', () => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		expect(apiGatewayProxyRest.isEvent("")).toBeFalse();
		expect(apiGatewayProxyRest.isEvent(lambdaEventFailure)).toBeFalse();
	});
});

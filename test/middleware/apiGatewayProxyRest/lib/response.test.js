const SmashLogger = require('../../../../lib/util/smashLogger');
SmashLogger.verbose({ level: "disable" });
const Response = require('../../../../lib/middleware/apiGatewayProxyRest/lib/response');
const ApiGatewayProxyRest = require('../../../../lib/middleware/apiGatewayProxyRest/apiGatewayProxyRest');
const defaultHeaders = {
	"Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
	"Access-Control-Allow-Origin": '*',
	"Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
};

describe('Response', () => {
	it('Test response instance success', () => {
		expect(() => new Response(new ApiGatewayProxyRest(), {})).not.toThrow();
	});

	it('Test response instance failure', () => {
		expect(() => new Response()).toThrow();
	});

	it('Test response handleError', () => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		apiGatewayProxyRest._callback = () => { };
		const response = new Response(apiGatewayProxyRest, {});
		expect(() => response.handleError(new Error())).not.toThrow();
	});

	it('Test response handleError with error code', () => {
		const apiGatewayProxyRest = new ApiGatewayProxyRest();
		apiGatewayProxyRest._callback = () => { };
		const response = new Response(apiGatewayProxyRest, {});
		expect(() => {
			const error = new Error("FOOBAR");
			error.statusCode = 500;
			response.handleError(error);
		}).not.toThrow();
	});
});

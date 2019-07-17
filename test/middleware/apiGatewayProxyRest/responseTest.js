const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Response = require('../../../lib/middleware/apiGatewayProxyRest/lib/response');
const ApiGatewayProxyRest = require('../../../lib/middleware/apiGatewayProxyRest/apiGatewayProxyRest');
const defaultHeaders = {
    "Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
};

describe('Response', function () {
    it('Test response instance success', function () {
        expect(function () {
            const response = new Response(new ApiGatewayProxyRest(), {});
        }).to.not.throw(Error);
    });

    it('Test response instance failure', function () {
        expect(function () {
            const response = new Response();
        }).to.throw(Error);
    });

    it('Test response handleError', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();
        apiGatewayProxyRest._callback = function () { };
        const response = new Response(apiGatewayProxyRest, {});
        expect(function () {
            response.handleError(new Error());
        }).to.not.throw(Error);
    });

    it('Test response handleError with error code', function () {
        const apiGatewayProxyRest = new ApiGatewayProxyRest();
        apiGatewayProxyRest._callback = function () { };
        const response = new Response(apiGatewayProxyRest, {});
        expect(function () {
            const error = new Error("FOOBAR");
            error.statusCode = 500;
            response.handleError(error);
        }).to.not.throw(Error);
    });
});



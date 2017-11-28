const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Response = require('../../../lib/middleware/apiGatewayProxy/lib/response.js');
const defaultHeaders = {
    "Access-Control-Allow-Headers": 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
};

describe('Response', function () {
    it('Test response instance', function () {
        //TODO
    });
});



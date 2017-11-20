const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Next = require('../lib/core/next.js');
const Request = require('../lib/core/request.js');
const Response = require('../lib/core/response.js');
const apiGatewayProxyRequest = require('./util/apiGatewayProxyRequest.js');

class Test extends Next {

}

class BadLink {
    handleRequest() {

    }
}

class GoodLink {
    handleRequest(request, response) {

    }
}

class GoodEnd {
    handleResponse(response) {

    }
}

describe('Next', function () {
    it('Test next instance creation failure', function () {
        expect(function () {
            const next = new Next();
        }).to.throw(Error);
    });

    it('Test next instance creation success', function () {
        expect(function () {
            const test = new Test();
        }).to.not.throw(Error);
    });

    it('Test bad setNext function', function () {
        const test = new Test();

        assert.isFunction(test.setNext);
        expect(function () {
            test.setNext();
        }).to.throw(Error);

        expect(function () {
            test.setNext("Foobar");
        }).to.throw(Error);

        expect(function () {
            test.setNext(function () {});
        }).to.throw(Error);

        expect(function () {
            test.setNext({});
        }).to.throw(Error);

        const badLink = new BadLink();
        expect(function () {
            test.setNext(badLink);
        }).to.throw(Error);
    });

    it('Test good setNext function', function () {
        const test = new Test();
        const goodLink = new GoodLink();
        assert.isFunction(test.setNext);
        expect(function () {
            test.setNext(goodLink);
        }).to.not.throw(Error);
    });

    it('Test no next function', function () {
        const test = new Test();

        expect(function () {
            test.next();
        }).to.throw(Error);
    });

    it('Test bad next function', function () {
        const test = new Test();
        const request = new Request(apiGatewayProxyRequest);
        const goodLink = new GoodLink();

        expect(function () {
            test.setNext(goodLink);
            test.next();
        }).to.throw(Error);

        expect(function () {
            test.setNext(goodLink);
            test.next({});
        }).to.throw(Error);

        expect(function () {
            test.setNext(goodLink);
            test.next({}, {});
        }).to.throw(Error);

        expect(function () {
            test.setNext(goodLink);
            test.next();
        }).to.throw(Error);

        expect(function () {
            test.setNext(goodLink);
            test.next(request);
        }).to.throw(Error);
    });

    it('Test next function', function () {
        const test = new Test();
        const spy = sinon.spy();
        const request = new Request(apiGatewayProxyRequest);
        const goodEnd = new GoodEnd();
        const response = new Response(goodEnd);
        const goodLink = new GoodLink();

        goodLink.handleRequest = function (request, response) {
            spy.call();
        };

        expect(function () {
            test.setNext(goodLink);
            test.next(request, response);
        }).to.not.throw(Error);

        assert.isOk(spy.called);
    });

    it('Test extends from console', function () {
        const test = new Test();
        assert.isFunction(test.log);
        assert.isFunction(test.info);
        assert.isFunction(test.warn);
        assert.isFunction(test.error);
    });
});

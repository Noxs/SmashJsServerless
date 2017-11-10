const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const Next = require('../lib/core/next.js');
const Request = require('../lib/core/request.js');
const Response = require('../lib/core/response.js');

class Test extends Next {

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
    });

    it('Test good setNext function', function () {
        const test = new Test();

        assert.isFunction(test.setNext);
        expect(function () {
            test.setNext(function ( {}, {}){
            });
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
        const request = new Request();

        expect(function () {
            test.setNext(function ( {}, {}){
            });
            test.next();
        }).to.throw(Error);

        expect(function () {
            test.setNext(function ( {}, {}){
            });
            test.next({});
        }).to.throw(Error);

        expect(function () {
            test.setNext(function ( {}, {}){
            });
            test.next({}, {});
        }).to.throw(Error);

        expect(function () {
            test.setNext((request, response) => {
            });
            test.next();
        }).to.throw(Error);

        expect(function () {
            test.setNext((request, response) => {
            });
            test.next(request);
        }).to.throw(Error);
    });


    it('Test next function', function () {
        const test = new Test();
        const spy = sinon.spy();
        const request = new Request();
        const response = new Response((parameter) => {
        });

        expect(function () {
            test.setNext((request, response) => {
                spy.call();
            });
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

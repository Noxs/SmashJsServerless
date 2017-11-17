const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Console = require('../lib/util/console.js');

describe('Console', function () {
    it('Test console instance', function () {
        const console = new Console();
        assert.isObject(console);
    });

    it('Test console log function', function () {
        const console = new Console();
        assert.isFunction(console.log);
    });
    
    it('Test console info function', function () {
        const console = new Console();
        assert.isFunction(console.info);
    });

    it('Test console warn function', function () {
        const console = new Console();
        assert.isFunction(console.warn);
    });

    it('Test console error function', function () {
        const console = new Console();
        assert.isFunction(console.error);
    });
});

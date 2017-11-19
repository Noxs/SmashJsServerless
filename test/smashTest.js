const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const smash = require('../smash.js');

describe('Smash', function () {
    it('Test smash boot', function () {
        smash.boot();
    });

    it('Test smash env', function () {
        smash.boot();

        //test _buildEnv instead of getter setter
    });

    it('Test smash util', function () {
        smash.boot();

        expect(function () {
            smash.util("testUtil");
        }).to.not.throw(Error);
    });

    it('Test smash database', function () {
        smash.boot();

        expect(function () {
            smash.database("testDatabase");
        }).to.not.throw(Error);
    });

    it('Test smash config', function () {
        smash.boot();
    });

    it('Test smash model', function () {
        smash.boot();
    });

    it('Test smash console', function () {
        smash.boot();
    });
});

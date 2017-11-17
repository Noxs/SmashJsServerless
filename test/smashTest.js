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
});

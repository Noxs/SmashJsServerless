const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Config = require('../lib/core/config.js');
const fs = require('fs');
const path = require('path');
const configTest = {
    "authorization": {
        "roles": {
            "ROLE_USER": {
            },
            "ROLE_ADMIN": {
                "childrens": [
                    "ROLE_USER"
                ]
            },
            "ROLE_SUPER_ADMIN": {
                "childrens": [
                    "ROLE_ADMIN"
                ]
            }
        }
    },
    "user_provider": {
        "dynamodb_table": "test_table",
        "region": "eu-west-1",
        "primary": "username"
    }
};

describe('Config', function () {
    it('Test config instance', function () {
        fs.renameSync(path.resolve(path.join(process.cwd(), "config.json")), path.resolve(path.join(process.cwd(), "config1.json")));
        expect(function () {
            const config = new Config();
        }).to.throw(Error);
        fs.renameSync(path.resolve(path.join(process.cwd(), "config1.json")), path.resolve(path.join(process.cwd(), "config.json")));

        expect(function () {
            const config = new Config();
        }).to.not.throw(Error);
    });
    it('Test config value access', function () {
        const config = new Config();
        assert.deepEqual(config.get(), configTest);
        assert.deepEqual(config.get("user_provider"), configTest.user_provider);
        assert.deepEqual(config.get("user_provider.region"), configTest.user_provider.region);
        assert.deepEqual(config.get("user_provider.notexist"), undefined);
    });
});

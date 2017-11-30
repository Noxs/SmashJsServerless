const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Config = require('../..//lib/core/config.js');
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
    "user_repository": {
        "file": "./database/testUser.js"
    },
    "response": {
        "headers": {
            "default": {
                "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
            }
        }
    }
};

describe('Config', function () {
    it('Test config instance failure', function () {
        Object.keys(require.cache).forEach(function (key) {
            delete require.cache[key];
        });
        fs.renameSync(path.resolve(path.join(process.cwd(), "config.json")), path.resolve(path.join(process.cwd(), "config1.json")));
        expect(function () {
            const config = new Config();
        }).to.throw(Error);
        fs.renameSync(path.resolve(path.join(process.cwd(), "config1.json")), path.resolve(path.join(process.cwd(), "config.json")));
    });

    it('Test config instance success', function () {
        expect(function () {
            const config = new Config();
        }).to.not.throw(Error);
    });

    it('Test config value access', function () {
        const config = new Config();
        assert.deepEqual(config.get(), configTest);
        assert.deepEqual(config.get("response"), configTest.response);
        assert.deepEqual(config.get("response.headers"), configTest.response.headers);
        assert.deepEqual(config.get("response.notexist"), undefined);
    });
});
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
const Config = require('../..//lib/core/config.js');
const fs = require('fs');
const path = require('path');

const configTest = {
    "apiGatewayProxy": {
        "authorization": {
            "roles": {
                "ROLE_USER": {},
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
    },
    "codePipelineJobEvent": {
        "ENV": "prod"
    },
    "cloudWatchEvent": {

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
        assert.deepEqual(config.get("apiGatewayProxy.response"), configTest.apiGatewayProxy.response);
        assert.deepEqual(config.get("apiGatewayProxy.response.headers"), configTest.apiGatewayProxy.response.headers);
        assert.deepEqual(config.get("apiGatewayProxy.response.notexist"), undefined);
    });

    it('Test config by string failure', function () {
        const config = new Config();
        expect(function () {
            config._byString(1);
        }).to.throw(Error);
    });

    it('Test config get bad argument', function () {
        const config = new Config();
        expect(function () {
            config.get(1);
        }).to.throw(Error);
    });
});

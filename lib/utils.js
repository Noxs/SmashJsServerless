var path = require('path');
var fs = require('fs-extra');

function utils() {
    var that = this;
    var rootPath = process.cwd();
    var templateDir = "../templates";
    var awsDir = "aws";
    var configFile = "config.json";
    var lambdaFile = "index.js";
    var codebuildFile = "buildspec.yml";
    that.copyFile = function (src, dest) {
        try {
            fs.copySync(src, dest);
        } catch (err) {
            console.error(err)
        }
    };
    that.initAws = function () {
        that.initLambda();
        that.initConfig();
        that.initCodebuild();
    };
    that.initLambda = function () {
        that.copyFile(path.resolve(path.join(__dirname, templateDir, awsDir, lambdaFile)), path.resolve(path.join(rootPath, lambdaFile)));
        console.log("Lambda index.js generated.");
    };
    that.initConfig = function () {
        that.copyFile(path.resolve(path.join(__dirname, templateDir, awsDir, configFile)), path.resolve(path.join(rootPath, configFile)));
        console.log("Lambda config.json generated.");
    };
    that.initCodebuild = function () {
        that.copyFile(path.resolve(path.join(__dirname, templateDir, awsDir, codebuildFile)), path.resolve(path.join(rootPath, codebuildFile)));
        console.log("Lambda buildspec.yml generated.");
    };
}

module.exports = new utils();
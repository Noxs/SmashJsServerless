var path = require('path');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');

function utils() {
    var that = this;
    var rootPath = process.cwd();
    var templateDir = "../templates";
    var awsDir = "aws";
    var configFile = "config.json";
    var lambdaFile = "index.js";
    var codebuildFile = "buildspec.yml";
    var controllerDirectory = "controller";
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
        that.initControllerDirectory();
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
    that.initControllerDirectory = function () {
        mkdirp.sync(path.resolve(path.join(rootPath, controllerDirectory)));
        console.log("Lambda controller directory generated.");
    };
    that.createNewController = function (controllerName) {
        mkdirp.sync(path.resolve(path.join(rootPath, controllerDirectory)));
        that.copyFile(path.resolve(path.join(__dirname, templateDir, codebuildFile)), path.resolve(path.join(rootPath, controllerDirectory, controllerName + ".js")));
        console.log("Lambda create new controller " + controllerName + ".js");
    };
}

module.exports = new utils();
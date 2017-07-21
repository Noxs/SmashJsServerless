var path = require('path');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var replace = require("replace");

function utils() {
    var that = this;
    var rootPath = process.cwd();
    var templateDir = "../templates";
    var awsDir = "aws";
    var configFile = "config.json";
    var lambdaFile = "index.js";
    var codebuildFile = "buildspec.yml";
    var controllerFile = "controller.js";
    var utilFile = "util.js";
    var databaseFile = "database.js";
    var controllerDirectory = "controller";
    var utilsDirectory = "utils";
    var databaseDirectory = "database";

    that.copyFile = function (src, dest) {
        try {
            fs.copySync(src, dest);
        } catch (err) {
            console.error(err);
        }
    };

    that.initAws = function () {
        that.initLambda();
        that.initConfig();
        that.initCodebuild();
        that.initDirectories();
    };

    that.initLambda = function () {
        that.copyFile(path.resolve(path.join(__dirname, templateDir, awsDir, lambdaFile)), path.resolve(path.join(rootPath, lambdaFile)));
        console.log("Index.js generated for aws lambda system.");
    };

    that.initConfig = function () {
        that.copyFile(path.resolve(path.join(__dirname, templateDir, awsDir, configFile)), path.resolve(path.join(rootPath, configFile)));
        console.log("Cconfig.json generated.");
    };


    that.initCodebuild = function () {
        that.copyFile(path.resolve(path.join(__dirname, templateDir, awsDir, codebuildFile)), path.resolve(path.join(rootPath, codebuildFile)));
        console.log("Buildspec.yml generated.");
    };

    that.initDirectories = function () {
        mkdirp.sync(path.resolve(path.join(rootPath, controllerDirectory)));
        mkdirp.sync(path.resolve(path.join(rootPath, utilsDirectory)));
        mkdirp.sync(path.resolve(path.join(rootPath, databaseDirectory)));
        console.log("Directories generated.");
    };

    that.createNewController = function (controllerName) {
        mkdirp.sync(path.resolve(path.join(rootPath, controllerDirectory)));
        that.copyFile(path.resolve(path.join(__dirname, templateDir, controllerFile)), path.resolve(path.join(rootPath, controllerDirectory, controllerName + ".js")));
        console.log("Lambda create new controller " + controllerName + ".js");
    };

    that.createNewDatabase = function (databaseName) {
        mkdirp.sync(path.resolve(path.join(rootPath, utilsDirectory)));
        that.copyFile(path.resolve(path.join(__dirname, templateDir, databaseFile)), path.resolve(path.join(rootPath, databaseDirectory, databaseName + ".js")));
        replace({
            regex: "DATABASE_NAME",
            replacement: databaseName[0].toUpperCase() + databaseName.slice(1),
            paths: [path.resolve(path.join(rootPath, databaseDirectory, databaseName + ".js"))],
            recursive: true,
            silent: true,
        });
        console.log("Lambda create new database " + databaseName + ".js");
    };

    that.createNewUtil = function (utilName) {
        mkdirp.sync(path.resolve(path.join(rootPath, utilsDirectory)));
        that.copyFile(path.resolve(path.join(__dirname, templateDir, utilFile)), path.resolve(path.join(rootPath, utilsDirectory, utilName + ".js")));
        console.log("Lambda create new util " + utilName + ".js");
    };
}

module.exports = new utils();
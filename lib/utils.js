var fs = require('fs');
var path = require('path');

function utils() {
    var that = this;
    var rootPath = process.cwd();
    var templateDir = "templates";
    var configFile = "config.json";
    var lambdaFile = "index.js";
    var codebuildFile = "buildspec.yml";
    that.copyFile = function (src, dest) {
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));
    };
    that.initAws = function () {
        that.initLambda();
        that.initConfig();
        that.initCodebuild();
    };
    that.initLambda = function () {
        that.copyFile(path.resolve(path.join(rootPath, templateDir, lambdaFile)), path.resolve(path.join(rootPath, lambdaFile)));
        console.log("Lambda index.js generated.");
    };
    that.initConfig = function () {
        that.copyFile(path.resolve(path.join(rootPath, templateDir, configFile)), path.resolve(path.join(rootPath, configFile)));
        console.log("Lambda config.json generated.");
    };
    that.initCodebuild = function () {
        that.copyFile(path.resolve(path.join(rootPath, templateDir, codebuildFile)), path.resolve(path.join(rootPath, codebuildFile)));
        console.log("Lambda buildspec.yml generated.");
    };
}

module.exports = new utils();
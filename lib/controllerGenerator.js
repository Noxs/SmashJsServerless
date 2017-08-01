var path = require('path');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var replace = require("replace");
var utils = require("./utils.js");

function controllerGenerator() {
    var that = this;
    var rootPath = process.cwd();
    var templateDir = "../templates/controller";
    var controllerFile = "controller.js";
    var controllerGetFile = "getController.js";
    var controllerGetFiles = "getControllers.js";
    var controllerPostFile = "postController.js";
    var controllerPutFile = "putController.js";
    var controllerDeleteFile = "deleteController.js";
    var controllerDirectory = "controller";

    that.initDirectory = function () {
        mkdirp.sync(path.resolve(path.join(rootPath, controllerDirectory)));
        console.log("Controller directory generated.");
    };

    that.createNewController = function (controllerName, customControllerFile) {
        that.initDirectory();
        if (!customControllerFile) {
            customControllerFile = path.resolve(path.join(__dirname, templateDir, controllerFile));
        } else {
            customControllerFile = path.resolve(path.join(__dirname, templateDir, customControllerFile));
        }
        controllerName = path.resolve(path.join(rootPath, controllerDirectory, controllerName + ".js"));
        mkdirp.sync(path.resolve(path.join(rootPath, controllerDirectory)));
        utils.copyFile(customControllerFile, controllerName);
        console.log("Create new controller " + controllerName + ".js from " + customControllerFile);
        return controllerName;
    };

    that.createNewRest = function (controllerName) {
        var files = [];
        var uppercaseName = controllerName[0].toUpperCase() + controllerName.slice(1);
        that.initDirectory();
        files.push(that.createNewController("get" + uppercaseName, controllerGetFile));
        files.push(that.createNewController("get" + uppercaseName + "s", controllerGetFiles));
        files.push(that.createNewController("post" + uppercaseName, controllerPostFile));
        files.push(that.createNewController("put" + uppercaseName, controllerPutFile));
        files.push(that.createNewController("delete" + uppercaseName, controllerDeleteFile));
        replace({
            regex: "CONTROLLER_NAME",
            replacement: controllerName,
            paths: files,
            recursive: true,
            silent: true
        });
        console.log("Created new REST ressource " + controllerName);
    };

}

module.exports = new controllerGenerator();
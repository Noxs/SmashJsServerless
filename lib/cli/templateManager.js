var program = require('commander');
var path = require('path');
const os = require('os');
var fs = require('fs-extra');
var config = require('./config.js');

function TemplateManager() {
    const key = "templates.json";
    const file = path.resolve(path.join(config.getDir(), key));
    const templateDir = "templates";
    const defaultTemplates = [
        {name: "index", file: "index.js", target: ''},
        {name: "config", file: "config.json", target: ''},
        {name: "codebuild", file: "buildspec.yml", target: ''}
    ];
    var that = this;
    var copyFile = function (src, dest) {
        return new Promise(function (resolve, reject) {
            try {
                copyFileSync(src, dest);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
    var copyFileSync = function (src, dest) {
        try {
            fs.copySync(src, dest);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    var save = function (data) {
        return config.saveConfig(key, data);
    };
    that.addTemplate = function (name, file, dir, target) {
        return new Promise(function (resolve, reject) {
            var templates = that.getTemplatesSync();
            var copiedFile = path.resolve(path.join(config.getDir(), templateDir, file));
            copyFileSync(dir, copiedFile);
            templates.push({name: name, file: file, path: copiedFile, target: target});
            save(templates).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save templates.", error);
                reject(error);
            });
        });
    };
    that.removeTemplate = function (name) {
        return new Promise(function (resolve, reject) {
            var templates = that.getTemplatesSync();
            for (var i = 0, length = templates.length; i < length; i++) {
                if (templates[i].name === name) {
                    templates.splice(i, 1);
                    break;
                }
            }
            save(templates).then(function () {
                resolve();
            }, function (error) {
                console.log("Failed to save templates.", error);
                reject(error);
            });
        });
    };
    that.getTemplates = function (name) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(that.getTemplatesSync(name));
            } catch (error) {
                reject(error);
            }
        });
    };
    that.getTemplatesSync = function (name) {
        var templates = config.loadConfigSync(key, file);
        if (name) {
            for (var i = 0, length = templates.length; i < length; i++) {
                if (templates[i].name === name) {
                    return templates[i];
                }
            }
            throw new Error("Template " + name + " not found.");
        } else {
            return templates;
        }
    };
    that.copyTemplate = function (dir, name) {
        return new Promise(function (resolve, reject) {
            var template = that.getTemplatesSync(name);
            copyFileSync(template.path, path.resolve(path.join(dir, template.target, template.file)));
            resolve();
        });
    };
    that.init = function () {
        return new Promise(function (resolve, reject) {
            var templates = defaultTemplates;
            var add = function (templates) {
                var template = templates.shift();
                that.addTemplate(template.name, template.file, path.resolve(path.join(__dirname, templateDir, template.file)), template.target).then(function () {
                    if (templates.length > 0) {
                        add(templates);
                    } else {
                        resolve();
                    }
                }, function (error) {
                    console.log("Failed to init templates.", error);
                    reject(error);
                });
            };
            add(templates);
        });
    };
}

var templateManager = new TemplateManager();
program.command('template:add <name> <dir> <target>')
        .description('add template')
        .action(function (name, dir, target) {
            //TODO
        });
program.command('template:remove <name>')
        .description('remove template')
        .action(function (name) {
            //TODO
        });
program.command('template:list')
        .description('list templates')
        .action(function () {
            templateManager.getTemplates().then(function (templates) {
                if (templates.length === 0) {
                    console.log("No template registered.");
                    process.exit(0);
                } else {
                    console.log("Templates (" + templates.length + "):");
                    for (var i = 0, length = templates.length; i < length; i++) {
                        console.log("  -  " + templates[i].name + ' ' + templates[i].file + " " + templates[i].path + " " + templates[i].target);
                    }
                    process.exit(0);
                }
            }, function (error) {
                console.log("Failed to list templates: ", error);
                process.exit(1);
            });
        });
module.exports = templateManager;
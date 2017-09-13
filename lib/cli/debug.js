var program = require('commander');
var projectManager = require("./projectManager.js");

function Debug() {
    var that = this;
    that.getRoutes = function (name) {
        return new Promise(function (resolve, reject) {
            var project;
            if (name) {
                project = projectManager.getProjectsSync(name);
            } else {
                project = projectManager.getCurrentProjectSync();
            }
            var smash = require('smash-js-serverless');
            smash.setRootPath(project.path);
            smash.boot();
            var routes = smash.getRouter().getRoutes();
            resolve(routes);
        });
    };
}

var debug = new Debug();
program.command('debug:route [name]')
        .description('Print routes')
        .action(function (name) {
            debug.getRoutes(name).then(function (routes) {
                if (routes.length === 0) {
                    console.log("No routes registered.");
                    process.exit(0);
                } else {
                    console.log("routes (" + routes.length + "):");
                    for (var i = 0, length = routes.length; i < length; i++) {
                        console.log(" - " + routes[i].method + " " + routes[i].path + '     ' + routes[i].authorizations);
                    }
                    process.exit(0);
                }
            }, function (error) {
                console.log("Failed to get routes.", error);
                process.exit(1);
            });
        });
module.exports = debug;
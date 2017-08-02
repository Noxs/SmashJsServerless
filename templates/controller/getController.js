var smash = require("smash-js-serverless");
var CONTROLLER_NAMEdb = require('../database/CONTROLLER_NAME.js');

smash.get({path: "/CONTROLLER_NAME/:id", authorizations: ["ROLE_USER"]}, function (request, response) {
    if (!request.parameters.id) {
        console.log("Missing id");
        response.badRequest("Missing id.");
        return;
    }
    response.noContent();
});
var smash = require("smash-js-serverless");
var CONTROLLER_NAMEdb = require('../database/CONTROLLER_NAME.js');

smash.post({path: "/CONTROLLER_NAME", authorizations: ["ROLE_USER"]}, function (request, response) {
     if (!request.body) {
        console.log("Missing fields.");
        response.badRequest("Missing fields.");
        return;
    }
    response.noContent();
});
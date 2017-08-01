var smash = require("smash-js-serverless");
var CONTROLLER_NAMEdb = require('../database/CONTROLLER_NAME.js');

smash.post({path: "/CONTROLLER_NAME", authorizations: ["ROLE_USER"]}, function (request, response) {
    response.noContent();
});
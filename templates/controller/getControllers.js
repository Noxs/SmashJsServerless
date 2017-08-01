var smash = require("smash-js-serverless");
var CONTROLLER_NAMEdb = require('../database/CONTROLLER_NAME.js');

smash.get({path: "/CONTROLLER_NAMEs", authorizations: ["ROLE_USER"]}, function (request, response) {
    response.noContent();
});
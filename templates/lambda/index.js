var smash = require("smash-js-serverless");

exports.handler = (event, context, callback) => {
    smash.boot(true);
    smash.handleRequest(event, callback);
};
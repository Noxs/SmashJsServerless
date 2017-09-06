var smash = require("smash-js-serverless");

exports.handler = (event, context, callback) => {
    smash.boot(process.env, true);
    smash.handleRequest(event, callback);
};
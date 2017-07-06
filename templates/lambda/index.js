var smash = require("smash-js-serverless");

exports.handler = (event, context, callback) => {
    smash.registerRequestMiddleware();
    smash.registerResponseMiddleware();
    smash.boot(true);
    smash.handleRequest(event, callback);
};
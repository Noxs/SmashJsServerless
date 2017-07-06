var smash = require("../smash.js");
function lambdaProxyResponse() {
    var that = this;
    var next = null;
    that.setNext = function (extNext) {
        next = extNext;
        return that;
    };
    that.handleResponse = function (response) {
        var formattedResponse = {};
        formattedResponse.code = response.code;
        formattedResponse.headers = response.headers;
        if (response.body) {
            formattedResponse.body = JSON.stringify(response.body);
        } else {
            formattedResponse.body = response.body;
        }
        next(null, formattedResponse);
        return true;
    };
}

smash.registerRequestMiddleware(new lambdaProxyResponse());
module.exports = smash.getResponseMiddleware();

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
        formattedResponse.statusCode = response.getCode();
        formattedResponse.headers = response.getHeaders();
        if (response.getBody()) {
            formattedResponse.body = JSON.stringify(response.getBody());
        } else {
            formattedResponse.body = response.getBody();
        }
        next(null, formattedResponse);
        return true;
    };
}

smash.registerResponseMiddleware(new lambdaProxyResponse());
module.exports = smash.getResponseMiddleware();

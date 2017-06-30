var execute = function () {
    var that = this;
    that.next = null;
    return {
        setNext: function (next) {
            that.next = next;
            return that;
        },
        handleResponse: function (response) {
            var formattedResponse = {};
            formattedResponse.code = response.code;
            formattedResponse.headers = response.headers;
            if (response.body) {
                formattedResponse.body = JSON.stringify(response.body);
            } else {
                formattedResponse.body = response.body;
            }
            that.next(null, formattedResponse);
            return true;
        }
    };
};

var lambdaProxyRequest = execute();
module.exports = lambdaProxyRequest;
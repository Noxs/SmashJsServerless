//TODO
//is it usefull to transform this in a class?
var request = function () {
    var that = this;
    that.method = null;
    that.version = null;
    that.env = null;
    that.url = null;
    that.host = null;
    that.path = null;
    that.headers = null;
    that.body = null;
    that.queryParamters = [];
    that.paramters = [];
    that.user = null;
    return {
        method: that.method,
        version: that.version,
        env: that.env,
        url: that.url,
        host: that.host,
        path: that.path,
        headers: that.headers,
        body: that.body,
        queryParamters: that.queryParamters,
        paramters: that.paramters,
        user: that.user
    };
};
module.exports = {
    createRequest: function () {
        return request();
    }
};
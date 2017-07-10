//TODO
//is it usefull to transform this in a class?
function request() {
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
}
module.exports = {
    createRequest: function () {
        return new request();
    }
};


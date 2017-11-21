//require('../../smash.js');

smash.post({path: "/test"}, function (request, response) {
    response.created({"data": {"foo": "bar"}});
});
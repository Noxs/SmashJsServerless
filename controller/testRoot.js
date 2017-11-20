//const smash = require('../smash.js');

smash.get({path: "/test"}, function (request, response) {
    response.ok({"data": {"foo": "bar"}});
});
smash.get({ path: "/test" }, function (request, response) {
    response.ok({ "data": { "foo": "bar" } });
}).post({ path: "/error" }, function (request, response) {
    response.internalServerError();
});
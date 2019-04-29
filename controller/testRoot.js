smash.get({ path: "/test", action: "GetTest" }, function (request, response) {
    response.ok({ "data": { "foo": "bar" } });
}).post({ path: "/error", action: "PostError" }, function (request, response) {
    response.internalServerError();
});
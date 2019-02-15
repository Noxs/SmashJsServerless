smash.post({ path: "/deep/test" }, function (request, response) {
    response.created({ "data": { "foo": "bar" } });
});
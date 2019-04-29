smash.post({ path: "/deep/test", action: "PostDeepTest" }, function (request, response) {
    response.created({ "data": { "foo": "bar" } });
});
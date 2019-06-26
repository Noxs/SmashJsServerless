smash.post({ path: "/test" , action: "PostTest"}, function (request, response) {
    response.created({ "data": { "foo": "bar" } });
});

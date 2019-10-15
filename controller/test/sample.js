smash.post({ path: "/test", action: "PostTest" }, (request, response) => {
	response.created({ "data": { "foo": "bar" } });
});

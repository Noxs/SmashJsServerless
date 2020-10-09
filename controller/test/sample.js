smash.post({ path: "/test", action: "PostTest", version: "10-2019" }, (request, response) => {
	response.created({ "data": { "foo": "bar" } });
});

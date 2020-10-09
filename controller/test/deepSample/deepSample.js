smash.post({ path: "/deep/test", action: "PostDeepTest", version: "10-2019" }, (request, response) => {
	response.created({ "data": { "foo": "bar" } });
});

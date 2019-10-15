smash.post({ path: "/deep/test", action: "PostDeepTest" }, (request, response) => {
	response.created({ "data": { "foo": "bar" } });
});

smash.get({ path: "/test", action: "GetTest" }, (request, response) => {
	response.ok({ "data": { "foo": "bar" } });
}).post({ path: "/error", action: "PostError" }, (request, response) => {
	response.internalServerError();
});

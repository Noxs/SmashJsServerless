smash.get({ path: "/test", action: "GetTest", version: "10-2019" }, (request, response) => {
	response.ok({ "data": { "foo": "bar" } });
}).post({ path: "/error", action: "PostError", version: "10-2019" }, (request, response) => {
	response.internalServerError();
});

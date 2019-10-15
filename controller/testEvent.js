smash.cloudWatchEvent({ source: "aws.codecommit", version: "0" }, event => {
	event.success();
});

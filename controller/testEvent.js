//const smash = require('../smash.js');

smash.cloudWatchEvent({source: "aws.codecommit", version: "0"}, function (event) {
    event.success();
});
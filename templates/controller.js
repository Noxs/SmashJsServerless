var smash = require("smash-js-serverless");

smash.get({path: "/", roles: ["ROLE_USER"]}, function (request, response) {
    //Method available:
    //smash.get
    //smash.post
    //smash.put
    //smash.delete
    //smash.head
    //smash.options


    //roles are optionnal
    //look at config.json in root folder


    //Reponse available
    //response.ok(object);
    //response.created(object);
    //response.noContent();
    //response.badRequest();
    //response.unauthorized();
    //response.forbidden();
    //response.notFound();
    //response.conflict();
    //response.internalServerError();
    //response.notImplemented();
    //response.serviceUnavailable();
});
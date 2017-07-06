var glob = require("glob");
var path = require('path');
var responseFactory = require('./core/response.js');
//TODO
//core module can be explicitly replaced by custom module
//add method call verification everywhere
//for the moment, correct chained module is not needed

//TODO
//change everywhere for object 
//currently returning that everywhere, and this is not good

//TODO 
//add core module that can add headers from endpoint definition

//TODO
//create abstraction for module
function smash() {
    var that = this;
    const corePath = __dirname + "/core/*.js";
    const middlewarePath = __dirname + "/middleware/*.js";
    const defaultControllerPath = "/controller/*.js";
    var logger = null;
    var userProvider = null;
    var router = null;
    var authorization = null;
    var config = null;
    //TODO maybe env are not usefull
    var envList = ["prod", "dev", "test"]; //useless?????
    var env = null; //Not used
    var debug = false;
    var logEnable = false;
    var rootPath = process.cwd();
    var controllerPath = defaultControllerPath;
    var requestMiddleware = null;
    var responseMiddleware = null;
    var loadCore = function () {
        var files = glob.sync(corePath);
        files.forEach(function (file) {
            require(path.resolve(file));
        });
        if (logEnable) {
            logger.log(files.length + " files loaded in the core directory.");
        }
        return that;
    };
    var loadConfig = function () {
        //TODO the problem here is this is not really DRY
        //find a solution to apply push config in an array of core module
        if (config) {
            config.load(rootPath);
            if (logger && typeof logger.getConfKeyword === 'function') {
                pushConfig(logger, logger.getConfKeyword());
            }
            if (userProvider && typeof userProvider.getConfKeyword === 'function') {
                pushConfig(userProvider, userProvider.getConfKeyword());
            }
            if (router && typeof router.getConfKeyword === 'function') {
                pushConfig(router, router.getConfKeyword());
            }
            if (authorization && typeof authorization.getConfKeyword === 'function') {
                pushConfig(authorization, authorization.getConfKeyword());
            }
        }
        //TODO
        //note that request and response are not here,
        //maybe they should be in another dir
        //or maybe migrate this module in another dir called basic module or something else
        return that;
    };
    var loadDefaultMiddleware = function () {
        var files = glob.sync(middlewarePath);
        if (logEnable) {
            logger.log(files.length + " files loaded in the middleware directory.");
        }
        files.forEach(function (file) {
            require(path.resolve(file));
        });
        return that;
    };
    var pushConfig = function (service, keyword) {
        service.applyConfig(config.get(keyword));
        return that;
    };
    loadControllers = function () {
        var files = glob.sync(rootPath + controllerPath);
        if (logEnable) {
            logger.log(files.length + " files loaded in the controllers directory.");
        }
        files.forEach(function (file) {
            require(path.resolve(file));
        });
        return that;
    };
    var executeController = function (request, response) {
        try {
            request.route.callback(request, response);
        } catch (err) {
            response.internalServerError("failed to process request");
        }
        if (responseMiddleware.handleResponse(response) === false) {
            if (logEnable) {
                logger.log("Middleware has not been able to process the response.");
            }
            //TODO
            //this is useless lol
            response.badRequest("bad request");
        }
        return that;
    };
    that.registerLogger = function (extLogger) {
        logger = extLogger;
        if (debug) {
            logEnable = true;
        }
        if (logEnable) {
            logger.log("Register logger module.");
        }
        return that;
    };
    that.getLogger = function () {
        return logger;
    };
    that.registerUserProvider = function (extUserProvider) {
        userProvider = extUserProvider;
        if (logEnable) {
            logger.log("Register user provider module.");
        }
        return that;
    };
    that.getUserProvider = function () {
        return userProvider;
    };
    that.registerRouter = function (extRouter) {
        router = extRouter;
        if (logEnable) {
            logger.log("Register router module.");
        }
        return that;
    };
    that.getRouter = function () {
        return router;
    };
    that.registerAuthorization = function (extAuthorization) {
        authorization = extAuthorization;
        if (logEnable) {
            logger.log("Register authorization module.");
        }
        return that;
    };
    that.getAuthorization = function () {
        return authorization;
    };
    that.registerConfig = function (extConfig) {
        config = extConfig;
        if (logEnable) {
            logger.log("Register config module.");
        }
        return that;
    };
    that.getConfig = function () {
        return config;
    };
    that.registerRequestMiddleware = function (extMiddleware) {
        //TODO maybe in the future rename this like entry point
        //because there are not really middleware
        //Add chained middleware can be a good idea
        requestMiddleware = extMiddleware;
        if (logEnable) {
            logger.log("Register request middleware module.");
        }
        return that;
    };
    that.getRequestMiddleware = function () {
        return requestMiddleware;
    };
    that.registerResponseMiddleware = function (extMiddleware) {
        //TODO same as request middleware
        responseMiddleware = extMiddleware;
        if (logEnable) {
            logger.log("Register response middleware module.");
        }
        return that;
    };
    that.getResponseMiddleware = function () {
        return responseMiddleware;
    };
    that.boot = function (extDebug) {
        //
        //TODO put it in a another var
        //the pruopose is that this var is hust  to ask debug activation
        //but if no logger is activated, something will be wrong
        //
        if (extDebug) {
            debug = true;
        } else {
            debug = false;
        }
        logEnable = false;
        //TODO
        //is this a good pattern, all module are loaded, then configuration are applied
        //there is no configuration apply to middleware
        loadCore();
        loadConfig();
        loadDefaultMiddleware();
        loadControllers();
        //TODO
        //linking here or when handle request??
        return that;
    };
    that.handleRequest = function (request, response) {
        requestMiddleware.setNext(userProvider.handleRequest, responseMiddleware.handleResponse);
        userProvider.setNext(router.handleRequest, responseMiddleware.handleResponse);
        router.setNext(authorization.handleRequest, responseMiddleware.handleResponse);
        authorization.setNext(executeController, responseMiddleware.handleResponse);
        responseMiddleware.setNext(response);
        var response = responseFactory.createResponse();
        requestMiddleware.handleRequest(request, response);
        return that;
    };
    that.getEnv = function () {
        //for the mmoment env var is not used
        return env;
    };

    that.debugIsActive = function () {
        return debug;
    };

    that.setRootPath = function (extRootPath) {
        //TODO maybe this is not usefull, for the moment no use case and this is not needed
        rootPath = extRootPath;
        if (logEnable) {
            logger.log("Change root path.");
        }
        return that;
    };

    that.resetRootPath = function () {
        //TODO this is needed for testing, but this is probably not a best practice
        rootPath = process.cwd();
        return that;
    };
    that.getRootPath = function () {
        return rootPath;
    };
    that.setControllerPath = function (extControllerPath) {
        //TODO throw an error if .js is not in the string
        //OR simply add it at the end
        controllerPath = extControllerPath;
        if (logEnable) {
            logger.log("Change controller path.");
        }
        return that;
    };
    that.getControllerPath = function () {
        return controllerPath;
    };
}

module.exports = new smash();


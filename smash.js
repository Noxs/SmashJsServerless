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
    const corePath = path.join(__dirname, "core", "*.js");
    const middlewarePath = path.join(__dirname, "middleware", "*.js");
    const defaultControllerPath = path.join("controller", "*.js");
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
        var files = glob.sync(path.resolve(corePath));
        files.forEach(function (file) {
            var module = require(path.resolve(file));
            if (module.build) {
                module.build();
            }
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
        var files = glob.sync(path.resolve(middlewarePath));
        if (logEnable) {
            logger.log(files.length + " files loaded in the middleware directory.");
        }
        files.forEach(function (file) {
            var module = require(path.resolve(file));
            if (module.build) {
                module.build();
            }
        });
        return that;
    };
    var pushConfig = function (service, keyword) {
        service.applyConfig(config.get(keyword));
        return that;
    };
    loadControllers = function () {
        var files = glob.sync(path.resolve(path.join(rootPath, controllerPath)));
        if (logEnable) {
            logger.log(files.length + " files loaded in the controller directory.");
        }
        files.forEach(function (file) {
            var module = require(path.resolve(file));
            if (module.build) {
                module.build();
            }
        });
        return that;
    };
    var executeController = function (request, response) {
        if (logEnable) {
            logger.log("Execute controller.");
        }
        try {
            request.route.callback(request, response);
        } catch (err) {
            response.internalServerError("failed to process request");
            if (logEnable) {
                logger.log("Error when executing controller.");
            }
        }
        if (logEnable) {
            logger.log("Execute controller done.");
        }
        if (logEnable) {
            logger.log("Handle response.");
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
        if (logger && debug) {
            logEnable = true;
        } else {
            logEnable = false;
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
        if (logEnable) {
            logger.log("Linking.");
        }
        requestMiddleware.setNext(router.handleRequest, responseMiddleware.handleResponse);
        router.setNext(userProvider.handleRequest, responseMiddleware.handleResponse);
        userProvider.setNext(authorization.handleRequest, responseMiddleware.handleResponse);
        authorization.setNext(executeController, responseMiddleware.handleResponse);
        responseMiddleware.setNext(response);
        if (logEnable) {
            logger.log("Handle request.");
        }
        var response = responseFactory.createResponse();
        requestMiddleware.handleRequest(request, response);
        return that;
    };
    that.getEnv = function () {
        //for the mmoment env var is not used
        return env;
    };

    that.debugIsActive = function () {
        return logEnable;
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
    //TODO check pattern for registering route is good or not, 
    //if not rework router component
    //as a clue, maybe just a function is enough
    that.get = function (route, callback) {
        router.get(route, callback);
        return that;
    };
    that.post = function (route, callback) {
        router.post(route, callback);
        return that;
    };
    that.put = function (route, callback) {
        router.put(route, callback);
        return that;
    };
    that.delete = function (route, callback) {
        router.delete(route, callback);
        return that;
    };
    that.patch = function (route, callback) {
        router.patch(route, callback);
        return that;
    };
    that.options = function (route, callback) {
        router.options(route, callback);
        return that;
    };
    that.head = function (route, callback) {
        router.head(route, callback);
        return that;
    };
}

module.exports = new smash();


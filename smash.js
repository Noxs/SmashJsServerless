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
var execute = function () {
    var that = this;
    const corePath = "./core/*.js";
    const middlewarePath = "./middleware/*.js";
    const defaultControllerPath = "/controller/*.js";
    that.logger = null;
    that.userProvider = null;
    that.router = null;
    that.authorization = null;
    that.config = null;
    //TODO maybe env are not usefull
    that.envList = ["prod", "dev", "test"]; //useless?????
    that.env = null;//Not used
    that.debug = false;
    that.logEnable = false;
    that.rootPath = process.cwd();
    that.controllerPath = defaultControllerPath;
    that.requestMiddleware = null;
    that.responseMiddleware = null;
    that.loadCore = function () {
        glob.sync(corePath).forEach(function (file) {
            require(path.resolve(file));
        });
        return that;
    };
    that.loadConfig = function () {
        //TODO the problem here is this is not really DRY
        //find a solution to apply push config in an array of core module
        if (that.config) {
            that.config.load(that.rootPath);
            if (that.logger && typeof that.logger.getConfKeyword === 'function') {
                that.pushConfig(that.logger, that.logger.getConfKeyword());
            }
            if (that.userProvider && typeof that.userProvider.getConfKeyword === 'function') {
                that.pushConfig(that.userProvider, that.userProvider.getConfKeyword());
            }
            if (that.router && typeof that.router.getConfKeyword === 'function') {
                that.pushConfig(that.router, that.router.getConfKeyword());
            }
            if (that.authorization && typeof that.authorization.getConfKeyword === 'function') {
                that.pushConfig(that.authorization, that.authorization.getConfKeyword());
            }
        }
        //TODO
        //note that request and response are not here,
        //maybe they should be in another dir
        //or maybe migrate this module in another dir called basic module or something else
        return that;
    };
    that.loadDefaultMiddleware = function () {
        glob.sync(middlewarePath).forEach(function (file) {
            require(path.resolve(file));
        });
        return that;
    };
    that.pushConfig = function (service, keyword) {
        service.applyConfig(that.config.get(keyword));
        return that;
    };
    that.loadControllers = function () {
        glob.sync(that.rootPath + that.controllerPath).forEach(function (file) {
            require(path.resolve(file));
        });
        return that;
    };
    that.executeController = function (request, response) {
        try {
            request.route.callback(request, response);
        } catch (err) {
            response.internalServerError("failed to process request");
        }
        if (that.responseMiddleware.handleResponse(response) === false) {
            if (that.logEnable) {
                that.logger.log("Middleware has not been able to process the response.");
            }
            //TODO
            //this is useless lol
            response.badRequest("bad request");
        }
        return that;
    };
    return {
        registerLogger: function (logger) {
            that.logger = logger;
            if (that.debug) {
                that.logEnable = true;
            }
            if (that.logEnable) {
                that.logger.log("Register logger module.");
            }
            return that;
        },
        getLogger: function () {
            return that.logger;
        },
        registerUserProvider: function (userProvider) {
            that.userProvider = userProvider;
            if (that.logEnable) {
                that.logger.log("Register user provider module.");
            }
            return that;
        },
        getUserProvider: function () {
            return that.userProvider;
        },
        registerRouter: function (router) {
            that.router = router;
            if (that.logEnable) {
                that.logger.log("Register router module.");
            }
            return that;
        },
        getRouter: function () {
            return that.router;
        },
        registerAuthorization: function (authorization) {
            that.authorization = authorization;
            if (that.logEnable) {
                that.logger.log("Register authorization module.");
            }
            return that;
        },
        getAuthorization: function () {
            return that.authorization;
        },
        registerConfig: function (config) {
            that.config = config;
            if (that.logEnable) {
                that.logger.log("Register config module.");
            }
            return that;
        },
        getConfig: function () {
            return that.config;
        },
        registerRequestMiddleware: function (middleware) {
            //TODO maybe in the future rename this like entry point
            //because there are not really middleware
            //Add chained middleware can be a good idea
            that.requestMiddleware = middleware;
            if (that.logEnable) {
                that.logger.log("Register request middleware module.");
            }
            return that;
        },
        getRequestMiddleware: function () {
            return that.requestMiddleware;
        },
        registerResponseMiddleware: function (middleware) {
            //TODO same as request middleware
            that.responseMiddleware = middleware;
            if (that.logEnable) {
                that.logger.log("Register response middleware module.");
            }
            return that;
        },
        getResponseMiddleware: function () {
            return that.responseMiddleware;
        },
        boot: function (debug) {
            //
            //TODO put it in a another var
            //the pruopose is that this var is hust  to ask debug activation
            //but if no logger is activated, something will be wrong
            //
            if (debug) {
                that.debug = true;
            } else {
                that.debug = false;
            }
            that.logEnable = false;

            //TODO
            //is this a good pattern, all module are loaded, then configuration are applied
            //there is no configuration apply to middleware
            that.loadCore().loadConfig().loadDefaultMiddleware().loadControllers();
            //TODO
            //linking here or when handle request??
            return that;
        },
        handleRequest: function (request, response) {
            that.requestMiddleware.setNext(that.userProvider.handleRequest);
            that.userProvider.setNext(that.router.handleRequest);
            that.router.setNext(that.authorization.handleRequest);
            that.authorization.setNext(that.executeController);
            that.responseMiddleware.setNext(response);
            var response = responseFactory.createResponse();
            if (that.requestMiddleware.handleRequest(request, response) === false) {
                if (that.logEnable) {
                    that.logger.log("Middleware has not been able to process the request.");
                }
                response.badRequest("bad request");
            }
            return that;
        },
        getEnv: function () {
            //for the mmoment env var is not used
            return that.env;
        },
        debugIsActive: function () {
            return that.debug;
        },
        setRootPath: function (rootPath) {
            //TODO maybe this is not usefull, for the moment no use case and this is not needed
            that.rootPath = rootPath;
            if (that.logEnable) {
                that.logger.log("Change root path.");
            }
            return that;
        },
        resetRootPath: function () {
            //TODO this is needed for testing, but this is probably not a best practice
            that.rootPath = process.cwd();
            return that;
        },
        getRootPath: function () {
            return that.rootPath;
        },
        setControllerPath: function (controllerPath) {
            //TODO throw an error if .js is not in the string
            //OR simply add it at the end
            that.controllerPath = controllerPath;
            if (that.logEnable) {
                that.logger.log("Change controller path.");
            }
            return that;
        },
        getControllerPath: function () {
            return that.controllerPath;
        }
    };
};
var smash = execute();
module.exports = smash;


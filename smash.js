const glob = require('glob');
const path = require('path');
const Logger = require("./lib/util/smashLogger");
const Config = require("./lib/core/config");
const Binder = require("./lib/core/binder");
const logger = new Logger("SmashJsServerless");
const SmashError = require("./lib/util/smashError");
const DEEP_EXT_JS = "**/*.js";
const FILE_EXT_JS = "*.js";
const PATHS = {
    MIDDLEWARE: "lib/middleware/*",
    HANDLER: "controller",
    DATABASE: "database",
    UTIL: "util",
    HELPER: "helper",
    SINGLETON: "singleton",
    GLOBAL: "global",
};
const AWS_REGION = "AWS_REGION";

class Smash {
    constructor() {
        this._init();
    }

    _init() {
        this._binder = new Binder();
        this._config = null;
        this._middlewares = null;
        this._magics = [];
        this._handlers = null;
        this._containerEnv = {};
        this._path = "";
        this._singletons = {};
    }

    _clearExpose() {
        for (let i = 0, length = this._magics.length; i < length; i++) {
            this[this._magics[i]] = null;
        }
        this._magics = [];
        return this;
    }

    _processExpose(module) {
        if (typeof module !== 'object' || typeof module.expose !== 'function') {
            logger.error("Middlewares must be object with a function called expose, " + Logger.typeOf(module, module.expose));
            throw new Error("Middlewares must be object with a function called expose, " + Logger.typeOf(module, module.expose));
        }
        const expose = module.expose();
        const that = this;
        for (let i = 0, length = expose.length; i < length; i++) {
            if (expose[i].functionName && this[expose[i].functionName]) {
                logger.error("Function " + expose[i].functionName + " already exist in smash, overwrite is not allowed");
                throw new Error("Function " + expose[i].functionName + " already exist in smash, overwrite is not allowed");
            }
            if (expose[i].getterName && this[expose[i].getterName]) {
                logger.error("Getter " + expose[i].getterName + " already exist in smash, overwrite is not allowed");
                throw new Error("Getter " + expose[i].getterName + " already exist in smash, overwrite is not allowed");
            }
            if (expose[i].functionName) {
                this[expose[i].functionName] = function () {
                    const returnedValue = module[expose[i].function].apply(module, arguments);
                    if (expose[i].return === true) {
                        return returnedValue;
                    } else {
                        return that;
                    }
                };
                this._magics.push(expose[i].functionName);
            }
            if (expose[i].getterName) {
                this[expose[i].getterName] = module[expose[i].getter];
                this._magics.push(expose[i].getterName);
            }
        }
        return this;
    }

    _registerMiddlewares() {
        this._clearExpose();
        this._middlewares = [];
        const files = glob.sync(path.join(__dirname, PATHS.MIDDLEWARE, FILE_EXT_JS));
        for (let i = 0, length = files.length; i < length; i++) {
            const Module = require(path.resolve(files[i]));
            const module = new Module();
            this._processExpose(module);
            this._middlewares.push(module);
            logger.info("Register middleware: " + module.constructor.name);
        }
        return this;
    }

    loadGlobals({ ignoreOverride, silent } = { ignoreOverride: false, silent: false }) {
        const files = glob.sync(path.join(this._path, PATHS.GLOBAL, FILE_EXT_JS));
        for (let i = 0, length = files.length; i < length; i++) {
            const filePath = path.resolve(files[i]);
            const { name } = path.parse(filePath);
            const globalToExpose = require(filePath);
            if (ignoreOverride === false && global[name]) {
                throw new Error("Global variable " + name + " is already defined");
            }
            global[name] = globalToExpose;
            Object.freeze(globalToExpose);
            if (silent === false) {
                logger.info("Load global: " + name);
            }
        }
        return this;
    }

    clearGlobals() {
        const files = glob.sync(path.join(this._path, PATHS.GLOBAL, FILE_EXT_JS));
        for (let i = 0, length = files.length; i < length; i++) {
            const filePath = path.resolve(files[i]);
            const { name } = path.parse(filePath);
            delete global[name];
        }
        return this;
    }

    shutdown() {
        this.clearGlobals();
        this._clearExpose();
        this._init();
    }

    _clearHandlers() {
        const files = glob.sync(path.resolve(path.join(this._path, PATHS.HANDLER, DEEP_EXT_JS)));
        for (let i = 0, length = files.length; i < length; i++) {
            delete require.cache[require.resolve(path.resolve(files[i]))]
        }
        return this;
    }

    _registerHandlers() {
        this._clearHandlers();
        this._handlers = [];
        const files = glob.sync(path.resolve(path.join(this._path, PATHS.HANDLER, DEEP_EXT_JS)));
        for (let i = 0, length = files.length; i < length; i++) {
            try {
                this._handlers.push(require(path.resolve(files[i])));
            } catch (error) {
                logger.error("Failed to register handler " + files[i], error);
                throw new Error("Failed to boot smash");
            }
        }
        logger.info("Handler loaded: " + files.length);
        return this;
    }

    getHandlers() {
        let handlers = [];
        for (let i = 0, length = this._middlewares.length; i < length; i++) {
            handlers = handlers.concat(this._middlewares[i].getHandlers());
        }
        return handlers;
    }

    getRoutes() {
        for (let i = 0, length = this._middlewares.length; i < length; i++) {
            if (this._middlewares[i].getRoutes) {
                return this._middlewares[i].getRoutes();
            }
        }
        throw new Error("No middleware found to get routes");
    }

    _buildEnv(context) {
        delete this._env;
        this._env = {};
        Object.assign(this._env, this._containerEnv);
        if (typeof module === 'object') {
            Object.assign(this._env, context);
        }
        return this;
    }

    _buildContainerEnv(env = {}) {
        Object.assign(this._containerEnv, env);
        Object.assign(this._containerEnv, process.env);
        this._buildEnv();
        return this;
    }

    boot({ path = process.cwd(), global = {}, env = {} } = { path: process.cwd(), global: {}, env: {} }) {
        this._path = path;
        this._config = new Config(this._path);
        this.loadGlobals(global);
        this._buildContainerEnv(env);
        this._registerMiddlewares();
        this._registerHandlers();
    }

    handleEvent(event, context, callback) {
        if (this._middlewares === null) {
            logger.error("Smash has not been booted, you must call boot() first", event);
            callback(new Error("Smash has not been booted, you must call boot() first"));
        } else {
            this._buildEnv(context);
            for (let i = 0, length = this._middlewares.length; i < length; i++) {
                if (this._middlewares[i].isEvent(event)) {
                    this._middlewares[i].handleEvent(event, context, callback);
                    return this;
                }
            }
            //FIX ME use smashError instead
            logger.error("No middleware found to process event", event);
            callback(new Error("No middleware found to process event"));
        }
        return this;
    }

    get env() {
        return this._env;
    }

    getEnv(key) {
        return this._env[key];
    }

    getEnvs(keys) {
        const array = [];
        keys.forEach((key) => {
            array.push(this.getEnv(key));
        });
        return array;
    }

    getRegion() {
        return this._env[AWS_REGION];
    }

    setEnv(key, value) {
        if (!this._env) {
            this._env = {};
        }
        this._env[key] = value;
        return this;
    }

    loadModule(dir, module) {
        try {
            return require(path.resolve(path.join(this._path, dir, module)));
        } catch (error) {
            logger.error("Failed to load module " + module, error, error.stack);
            throw error;
        }
    }

    util(module) {
        if (typeof module !== 'string' || module.length === 0) {
            throw new Error("First parameter of util must be a valid string, " + Logger.typeOf(module));
        }
        return this.loadModule(PATHS.UTIL, module);
    }

    helper(module) {
        if (typeof module !== 'string' || module.length === 0) {
            throw new Error("First parameter of helper must be a valid string, " + Logger.typeOf(module));
        }
        return this.loadModule(PATHS.HELPER, module);
    }

    _loadSingletonModule(module) {
        try {
            return this.loadModule(PATHS.SINGLETON, module);
        } catch (error) {
            return require(module);
        }
    }

    _instanciateModule(module) {
        if (module.constructor) {
            return new module();
        }
        return module;
    }

    _bootSingletonModule(module) {
        if (this._singletons[module].load) {
            this._singletons[module].load().catch(error => {
                logger.error("Failed to boot singleton module " + module, error);
            });
        }
    }

    singleton(module) {
        if (typeof module !== 'string' || module.length === 0) {
            throw new Error("First parameter of singleton must be a valid string, " + Logger.typeOf(module));
        }
        if (this._singletons[module]) {
            return this._singletons[module];
        } else {
            try {
                const requiredModule = this._loadSingletonModule(module);
                this._singletons[module] = this._instanciateModule(requiredModule);
                this._bootSingletonModule(module);
            } catch (error) {
                throw new Error("Cannot find module " + module);
            }
        }
    }

    global(module) {
        if (typeof module !== 'string' || module.length === 0) {
            throw new Error("First parameter of global must be a valid string, " + Logger.typeOf(module));
        }
        return this.loadModule(PATHS.GLOBAL, module);
    }

    database(module) {
        if (typeof module !== 'string' || module.length === 0) {
            throw new Error("First parameter of database must be a valid string, " + Logger.typeOf(module));
        }
        return this.loadModule(PATHS.DATABASE, module);
    }

    get config() {
        return this._config;
    }

    setCurrentEvent(event) {
        this._currentEvent = event;
        return this;
    }

    get binder() {
        return this._binder;
    }

    registerRequiredRule(...args) {
        return this.binder.registerRequiredRule(...args);
    }

    registerMergeRule(...args) {
        return this.binder.registerMergeRule(...args);
    }

    registerCleanRule(...args) {
        return this.binder.registerCleanRule(...args);
    }

    mergeObject(...args) {
        if (args.length === 2 && this._currentEvent && this._currentEvent.route && this._currentEvent.route.action) {
            args.unshift(this._currentEvent.route.action);
        }
        return this.binder.mergeObject(...args);
    }

    clean(...args) {
        return this.binder.clean(...args);
    }

    get DynamodbModel() {
        return require(path.resolve(path.join(__dirname, "lib/util/dynamodbModel.js")));
    }

    get Logger() {
        return require(path.resolve(path.join(__dirname, "lib/util/smashLogger.js")));
    }

    get Console() {
        logger.deprecated("smash.Console is deprecated, use smash.Logger in the future");
        return this.Logger;
    }

    set Console(console) {

    }

    smashError(...args) {
        logger.deprecated("Method smashError(options) is deprecated, use smash.errorUtil");
        return new SmashError.SmashError(...args);
    }

    get SmashError() {
        return SmashError;
    }

    logger(namespace) {
        return new Logger(namespace);
    }

    //FIX ME remove for the next major ??
    get codes() {
        return {
            badRequest: 400,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
            conflict: 409,
            internalServerError: 500,
            notImplemented: 501,
            serviceUnavailable: 502
        };
    }
}

if (!global.smash) {
    global.smash = new Smash();
}
module.exports = global.smash;


const glob = require('glob');
const path = require('path');
const Logger = require("./lib/util/smashLogger");
const Config = require("./lib/core/config");
const Binder = require("./lib/core/binder");
const logger = new Logger("SmashJsServerless");
const SmashError = require("./lib/util/smashError");
const EXT_JS = ".js";
const DEEP_EXT_JS = "**/*.js";
const FILE_EXT_JS = "*.js";
const PATHS = {
    MIDDLEWARE: "lib/middleware/*",
    HANDLER: "controller",
    DATABASE: "database",
    UTIL: "util",
    HELPER: "helper",
    GLOBAL: "global",
};
const AWS_REGION = "AWS_REGION";

class Smash {
    constructor() {
        this._config = new Config();
        this._binder = new Binder();
        this._middlewares = null;
        this._magics = [];
        this._handlers = null;
        this._containerEnv = {};
    }

    _clearExpose() {
        for (let i = 0, length = this._magics.length; i < length; i++) {
            delete this[this._magics[i]];
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
            if (this[expose[i].functionName]) {
                logger.error("Function " + expose[i].functionName + " already exist in smash, overwrite is not allowed");
                throw new Error("Function " + expose[i].functionName + " already exist in smash, overwrite is not allowed");
            }
            this[expose[i].functionName] = function () {
                module[expose[i].function].apply(module, arguments);
                return that;
            };
            this._magics.push(expose[i].functionName);
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

    loadGlobals({ ignoreOverride } = { ignoreOverride: false }) {
        const files = glob.sync(path.join(__dirname, PATHS.GLOBAL, FILE_EXT_JS));
        for (let i = 0, length = files.length; i < length; i++) {
            const filePath = path.resolve(files[i])
            const { name } = path.parse(filePath).name;
            const globalToExpose = require(filePath);
            if (ignoreOverride === false && global[name]) {
                throw new Error("Global variable " + name + " is already defined");
            }
            global[name] = globalToExpose;
            logger.info("Load global: " + name);
        }
        return this;
    }

    _clearHandlers() {
        const files = glob.sync(path.resolve(path.join(process.cwd(), PATHS.HANDLER, DEEP_EXT_JS)));
        for (let i = 0, length = files.length; i < length; i++) {
            delete require.cache[require.resolve(path.resolve(files[i]))]
        }
        return this;
    }

    _registerHandlers() {
        this._clearHandlers();
        this._handlers = [];
        const files = glob.sync(path.resolve(path.join(process.cwd(), PATHS.HANDLER, DEEP_EXT_JS)));
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

    _buildEnv(context) {
        delete this._env;
        this._env = {};
        Object.assign(this._env, this._containerEnv);
        if (typeof module === 'object') {
            Object.assign(this._env, context);
        }
        return this;
    }

    _buildContainerEnv() {
        Object.assign(this._containerEnv, process.env);
        this._buildEnv();
        return this;
    }

    boot() {
        this.loadGlobals();
        this._buildContainerEnv();
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
        this._env[key] = value;
    }

    loadModule(dir, module) {
        try {
            return require(path.resolve(path.join(process.cwd(), dir, module + EXT_JS)));
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


const glob = require('glob');
const path = require('path');
const Console = require("./lib/util/console.js");
const Config = require("./lib/core/config.js");
const EXT_JS = ".js";
const DEEP_EXT_JS = "**/*.js";
const FILE_EXT_JS = "*.js";
const MIDDLEWARE_PATH = "lib/middleware/*";
const HANDLER_PATH = "controller";
const DATABASE_PATH = "database";
const UTIL_PATH = "util";

class Smash extends Console {
    constructor() {
        super();
        this._config = new Config();
        this._middlewares = null;
        this._magics = [];
        this._handlers = null;
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
            this.error("Middlewares must be object with a function called expose, " + this.typeof(module) + ' ' + this.typeof(module.expose) + ' given');
            throw new Error("Middlewares must be object with a function called expose, " + this.typeof(module) + ' ' + this.typeof(module.expose) + ' given');
        }
        const expose = module.expose();
        const that = this;
        for (let i = 0, length = expose.length; i < length; i++) {
            if (this[expose[i].functionName]) {
                this.error("Function " + expose[i].functionName + " already exist in smash, overwrite is not allowed");
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
        const files = glob.sync(path.join(__dirname, MIDDLEWARE_PATH, FILE_EXT_JS));
        for (let i = 0, length = files.length; i < length; i++) {
            const Module = require(path.resolve(files[i]));
            const module = new Module();
            this._processExpose(module);
            this._middlewares.push(module);
            this.info("Register middleware: " + module.constructor.name);
        }
        return this;
    }

    _clearHandlers() {
        const files = glob.sync(path.resolve(path.join(process.cwd(), HANDLER_PATH, DEEP_EXT_JS)));
        for (let i = 0, length = files.length; i < length; i++) {
            delete require.cache[require.resolve(path.resolve(files[i]))]
        }
        return this;
    }

    _registerHandlers() {
        this._clearHandlers();
        this._handlers = [];
        const files = glob.sync(path.resolve(path.join(process.cwd(), HANDLER_PATH, DEEP_EXT_JS)));
        for (let i = 0, length = files.length; i < length; i++) {
            try {
                this._handlers.push(require(path.resolve(files[i])));
            } catch (error) {
                this.error("Failed to register handler " + files[i], error);
                throw new Error("Failed to boot smash");
            }
        }
        this.info("Handler loaded: " + files.length);
        return this;
    }

    _buildEnv(context) {
        delete this._env;
        this._env = {};
        Object.assign(this._env, process.env);
        Object.assign(this._env, context);
        this._setEnv("ENV", context.invokedFunctionArn.split(":").pop());
        Object.freeze(this._env);
        return this;
    }

    boot() {
        this._registerMiddlewares();
        this._registerHandlers();
    }

    handleEvent(event, context, callback) {
        if (this._middlewares === null) {
            this.error("Smash has not been booted, you must call boot() first", event);
            callback(new Error("Smash has not been booted, you must call boot() first"));
        } else {
            this._buildEnv(context);
            for (let i = 0, length = this._middlewares.length; i < length; i++) {
                if (this._middlewares[i].isEvent(event)) {
                    this._middlewares[i].handleEvent(event, context, callback);
                    return this;
                }
            }
            this.error("No middleware found to process event", event);
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

    _setEnv(key, value) {
        this._env[key] = value;
    }

    util(module) {
        if (typeof module !== 'string' || module.length === 0) {
            throw new Error("First parameter of util must be a valid string, " + this.typeOf(module) + "given");
        }
        return require(path.resolve(path.join(process.cwd(), UTIL_PATH, module + EXT_JS)));
    }

    database(module) {
        if (typeof module !== 'string' || module.length === 0) {
            throw new Error("First parameter of util must be a valid string, " + this.typeOf(module) + "given");
        }
        return require(path.resolve(path.join(process.cwd(), DATABASE_PATH, module + EXT_JS)));
    }

    get config() {
        return this._config;
    }

    get Model() {
        return require(path.resolve(path.join(__dirname, "lib/util/model.js")));
    }

    get Console() {
        return require(path.resolve(path.join(__dirname, "lib/util/console.js")));
    }

    set Console(console) {

    }
}

if (!global.smash) {
    global.smash = new Smash();
}
module.exports = global.smash;


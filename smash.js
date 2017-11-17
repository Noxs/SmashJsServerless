const glob = require('glob');
const path = require('path');
const Console = require("./lib/util/console.js");
const Config = require("./lib/core/config.js");
const EXT_JS = ".js";
const DEEP_EXT_JS = "**/*.js";
const MIDDLEWARE_PATH = "lib/middleware";
const HANDLER_PATH = "controller";
const DATABASE_PATH = "database";
const UTIL_PATH = "util";

class Smash extends Console {
    constructor() {
        super();
        this._config = new Config();
        this._middlewares = [];
    }

    _registerMiddlewares() {
        const files = glob.sync(path.resolve(path.join(__dirname, MIDDLEWARE_PATH, DEEP_EXT_JS)));
        for (let i = 0, length = files.length; i < length; i++) {
            const Module = require(path.resolve(files[i]));
            const module = new Module();
            this._middlewares.push(module);
            this.info("Register middleware: " + module.constructor.name);
        }
        return this;
    }

    _registerHandlers() {
        const files = glob.sync(path.resolve(path.join(process.cwd(), HANDLER_PATH)));
        for (let i = 0, length = files.length; i < length; i++) {
            require(path.resolve(files[i]));
        }
        this.info("Handler loaded: " + files.length);
        return this;
    }

    _buildEnv(context) {
        delete this.env;
        this.env = {};
        Object.assign(this.env, process.env);
        setEnv("ENV", context.functionVersion);
        Object.freeze(this.env);
        return this;
    }

    boot() {
        this._registerMiddlewares();
        this._registerHandlers();
    }

    handleEvent(event, context, callback) {
        this._buildEnv(context);
        for (let i = 0, length = this._middlewares.length; i < length; i++) {
            if (this._middlewares[i].isEvent(event)) {
                this._middlewares[i].handleEvent(event, callback);
                return this;
            }
        }
        this.error("No middleware found to process event", event);
        callback(new Error("No middleware found to process event"));
        return this;
    }

    /*Refactor this*/

    get(route, callback) {
        this._apiGatewayProxy.get(route, callback);
        return this;
    }

    post(route, callback) {
        this._apiGatewayProxy.post(route, callback);
        return this;
    }

    put(route, callback) {
        this._apiGatewayProxy.put(route, callback);
        return this;
    }

    delete(route, callback) {
        this._apiGatewayProxy.delete(route, callback);
        return this;
    }

    patch(route, callback) {
        this._apiGatewayProxy.patch(route, callback);
        return this;
    }

    options(route, callback) {
        this._apiGatewayProxy.options(route, callback);
        return this;
    }

    head(route, callback) {
        this._apiGatewayProxy.head(route, callback);
        return this;
    }

    event(source, callback) {
        this._cloudWatchEvent.event(source, callback);
        return this;
    }

    /*End refactor this*/

    get env() {
        return this._env;
    }

    getEnv(key) {
        return this.env[key];
    }

    setEnv(key, value) {
        this.env[key] = value;
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

    get model() {
        return require(path.resolve(path.join(process.cwd(), "lib/util/model.js")));
    }

    get console() {
        return require(path.resolve(path.join(process.cwd(), "lib/util/console.js")));
    }

}

module.exports = new Smash();
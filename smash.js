require("./lib/core/js/array");
require("./lib/core/js/object");
const glob = require('glob');
const path = require('path');
const Logger = require("./lib/util/smashLogger");
const Config = require("./lib/core/config");
const Filter = require("./lib/core/filter/filter");
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
		this._filter = null;
		this._config = null;
		this._middlewares = null;
		this._magics = [];
		this._handlers = [];
		this._containerEnv = {};
		this._path = "";
		this._singletons = {};
		this._singletonOptions = null;
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
				this[expose[i].functionName] = (...args) => {
					const returnedValue = module[expose[i].function](...args);
					if (expose[i].return === true) {
						return returnedValue;
					}
					return that;
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
			global = { ...this.global, ...globalToExpose };
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
		this._clearHandlers();
		this._init();
	}

	_clearHandlers() {
		this._handlers.forEach(handler => delete require.cache[handler]);
		return this;
	}

	_registerHandlers() {
		this._clearHandlers();
		this._handlers = [];
		const files = glob.sync(path.resolve(path.join(this._path, PATHS.HANDLER, DEEP_EXT_JS)));
		for (let i = 0, length = files.length; i < length; i++) {
			try {
				require(path.resolve(files[i]));
				this._handlers.push(path.resolve(files[i]));
			} catch (error) {
				logger.error("Failed to register handler " + files[i]);
				logger.error("Failed to boot smash");
				throw error;
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
		this._env = { ...this._env, ...this._containerEnv };
		if (typeof module === 'object') {
			this._env = { ...this._env, ...context };
		}
		return this;
	}

	_buildContainerEnv(env = {}) {
		this._containerEnv = { ...this._containerEnv, ...env, ...process.env };
		this._buildEnv();
		return this;
	}

	_setupSingletonOptions(options = {}) {
		this._singletonOptions = options;
		return this;
	}

	boot({ path = process.cwd(), global = {}, env = {}, verbose = {}, singleton = {} } = { path: process.cwd(), global: {}, env: {}, verbose: {}, singleton: {} }) {
		logger.verbose(verbose);
		this._path = path;
		this._config = new Config(this._path);
		this._filter = new Filter();
		this.loadGlobals(global);
		this._buildContainerEnv(env);
		this._registerMiddlewares();
		this._setupSingletonOptions(singleton);
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
		return keys.map(key => this.getEnv(key));
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
			logger.error("Failed to load " + dir + " module " + module, error, error.stack);
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

	_instanciateModule(Module) {
		if (Module.constructor) {
			return new Module();
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

	singleton(module, optionsOverwrite = { instanciate: true, boot: true, requireOnly: false }) {
		const options = { ...optionsOverwrite, ...this._singletonOptions };
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of singleton must be a valid string, " + Logger.typeOf(module));
		}
		const requiredModule = this._loadSingletonModule(module);
		if (options.requireOnly === true) {
			return requiredModule;
		}
		if (this._singletons[module]) {
			return this._singletons[module];
		}
		if (options.instanciate) {
			this._singletons[module] = this._instanciateModule(requiredModule);
		}
		if (options.boot) {
			this._bootSingletonModule(module);
		}
		return this._singletons[module];
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

	getCurrentEvent() {
		return this._currentEvent;
	}

	get filter() {
		return this._filter;
	}

	for(action) {
		return this.filter.for(action);
	}

	inRule(item) {
		return this.filter.inRule(item);
	}

	mergeRule(item) {
		return this.filter.mergeRule(item);
	}

	outRule(item) {
		return this.filter.outRule(item);
	}

	cleanIn(...args) {
		return this.filter.cleanOut(...args);
	}

	merge(...args) {
		return this.filter.merge(...args);
	}

	cleanOut(...args) {
		return this.filter.cleanOut(...args);
	}

	get DynamodbModel() {
		return require(path.resolve(path.join(__dirname, "lib/util/dynamodbModel.js")));
	}

	get Logger() {
		return require(path.resolve(path.join(__dirname, "lib/util/smashLogger.js")));
	}

	get SmashError() {
		return SmashError;
	}

	errorUtil(namepace = SmashError.getNamespace()) {
		return new SmashError(namepace);
	}

	logger(namespace = SmashError.getNamespace()) {
		return new Logger(namespace);
	}
}

if (!global.smash) {
	global.smash = new Smash();
}
module.exports = global.smash;


const glob = require('glob');
const path = require('path');
const Logger = require("./lib/util/smashLogger");
const Config = require("./lib/core/config");
const Filter = require("./lib/core/filter/filter");
const { extend } = require("./lib/core/js/extend");
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
	API: "api",
	VALIDATOR: "validator",
	MERGER: "merger",
	TRANSFROMER: "transformer",
	PERMISSION: "permission",
};
const AWS_REGION = "AWS_REGION";
const VERBOSE_LEVEL = "VERBOSE_LEVEL";

class Smash {
	constructor() {
		this._init();
	}

	_init() {
		this._logger = null;
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
			this._logger.error("Middlewares must be object with a function called expose, " + Logger.typeOf(module, module.expose));
			throw new Error("Middlewares must be object with a function called expose, " + Logger.typeOf(module, module.expose));
		}
		const expose = module.expose();
		const that = this;
		for (let i = 0, length = expose.length; i < length; i++) {
			if (expose[i].functionName && this[expose[i].functionName]) {
				this._logger.error("Function " + expose[i].functionName + " already exist in smash, overwrite is not allowed");
				throw new Error("Function " + expose[i].functionName + " already exist in smash, overwrite is not allowed");
			}
			if (expose[i].getterName && this[expose[i].getterName]) {
				this._logger.error("Getter " + expose[i].getterName + " already exist in smash, overwrite is not allowed");
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
			this._logger.info("Register middleware: " + module.constructor.name);
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
			Object.assign(global, globalToExpose);
			Object.freeze(globalToExpose);
			if (silent === false) {
				this._logger.info("Load global: " + name);
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
				this._logger.error("Failed to register handler " + files[i]);
				this._logger.error("Failed to boot smash");
				throw error;
			}
		}
		this._logger.info("Handler loaded: " + files.length);
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
		Logger.verbose(verbose);
		this._logger = new Logger("SmashJsServerless");
		this._path = path;
		this._config = new Config(this._path);
		this._filter = new Filter();
		this.loadGlobals(global);
		this._buildContainerEnv(env);
		this._setupVerbose(verbose);
		this._registerMiddlewares();
		this._setupSingletonOptions(singleton);
		this._registerHandlers();
	}

	_setupVerbose(verbose) {
		if (!verbose.level) {
			const level = this.getEnv(VERBOSE_LEVEL);
			if (level) {
				Logger.verbose({ ...verbose, level });
			}
		}
		return this;
	}

	handleEvent(event, context, callback) {
		if (this._middlewares === null) {
			this._logger.error("Smash has not been booted, you must call boot() first", event);
			callback(new Error("Smash has not been booted, you must call boot() first"));
		} else {
			this._buildEnv(context);
			this._clearSingleton();
			for (let i = 0, length = this._middlewares.length; i < length; i++) {
				if (this._middlewares[i].isEvent(event)) {
					this._middlewares[i].handleEvent(event, context, callback);
					return this;
				}
			}
			this._logger.error("No middleware found to process event", event);
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
			this.logger().error("Failed to load " + dir + " module " + module, error, error.stack);
			throw error;
		}
	}

	util(module) {
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of util must be a valid string, " + Logger.typeOf(module));
		}
		return this.loadModule(PATHS.UTIL, module);
	}

	api(module) {
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of api must be a valid string, " + Logger.typeOf(module));
		}
		return this.loadModule(PATHS.API, module);
	}

	helper(module) {
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of helper must be a valid string, " + Logger.typeOf(module));
		}
		return this.loadModule(PATHS.HELPER, module);
	}

	validator(module) {
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of validator must be a valid string, " + Logger.typeOf(module));
		}
		return this.loadModule(PATHS.VALIDATOR, module);
	}

	merger(module) {
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of merger must be a valid string, " + Logger.typeOf(module));
		}
		return this.loadModule(PATHS.MERGER, module);
	}

	transformer(module) {
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of transformer must be a valid string, " + Logger.typeOf(module));
		}
		return this.loadModule(PATHS.TRANSFROMER, module);
	}

	permission(module) {
		if (typeof module !== 'string' || module.length === 0) {
			throw new Error("First parameter of permission must be a valid string, " + Logger.typeOf(module));
		}
		return this.loadModule(PATHS.PERMISSION, module);
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
			try {
				const value = this._singletons[module].load();
				if (value.catch) {
					value.catch(error => {
						this._logger.error("Failed to boot singleton module " + module, error);
					});
				}
			} catch (error) {
				this._logger.error("Failed to boot singleton module " + module, error);
			}
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

	_clearSingleton() {
		for (const singletonName in this._singletons) {
			if (this._singletons[singletonName].clear) {
				try {
					const value = this._singletons[singletonName].clear();
					if (value.catch) {
						value.catch(error => {
							this._logger.error("Failed to clear singleton module " + singletonName, error);
						});
					}
				} catch (error) {
					this._logger.error("Failed to clear singleton module " + singletonName, error);
				}
			}
		}
		return this;
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
		this._logger.deprecated("Method for is deprecated");
		return this.filter.for(action);
	}

	inRule(item) {
		this._logger.deprecated("Method inRule is deprecated");
		return this.filter.inRule(item);
	}

	mergeRule(item) {
		this._logger.deprecated("Method mergeRule is deprecated");
		return this.filter.mergeRule(item);
	}

	outRule(item) {
		this._logger.deprecated("Method outRule is deprecated");
		return this.filter.outRule(item);
	}

	cleanIn(...args) {
		this._logger.deprecated("Method cleanIn is deprecated");
		return this.filter.cleanIn(...args);
	}

	merge(...args) {
		this._logger.deprecated("Method merge is deprecated");
		return this.filter.merge(this.getCurrentEvent().route, ...args);
	}

	cleanOut(...args) {
		this._logger.deprecated("Method cleanOut is deprecated");
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

	extend(...args) {
		return extend(...args);
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


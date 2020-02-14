const SPACER = ", ";

const LEVELS = [
	"info",
	"log",
	"deprecated",
	"warn",
	"error",
	"disable",
];

if (!global.smashLogger) {
	global.smashLogger = {};
}
if (!global.smashLogger.verbose) {
	global.smashLogger.verbose = {};
}

class Logger {
	constructor(namespace = null) {
		this._namespace = namespace;
		this._verbose = global.smashLogger.verbose;
	}

	static verbose(options = {}) {
		global.smashLogger.verbose = options;
		return this;
	}

	typeOf(...args) {
		return args.map(arg => {
			if (arg && typeof arg === "object") {
				return "type " + typeof arg + " / class " + arg.constructor.name + " given";
			}
			return "type " + typeof arg + " given";
		}).join(SPACER);
	}

	buildError(message, code) {
		const error = new Error(message);
		if (code) {
			error.statusCode = code;
		}
		return error;
	}

	verbose(options = {}) {
		this._verbose = options;
		return this;
	}

	namespace(namespace) {
		this._namespace = namespace;
		return this;
	}

	getPrefix(level) {
		if (this._namespace && level) {
			return this._namespace + " " + level + ": ";
		}
		if (this._namespace) {
			return this._namespace + ": ";
		}
		return ": ";
	}

	isVerbose(level) {
		if (this._verbose.level) {
			if (LEVELS.indexOf(level) >= LEVELS.indexOf(this._verbose.level)) {
				return true;
			}
			return false;
		}
		if (this._verbose[level] !== false) {
			return true;
		}
		return false;
	}

	print(...args) {
		console.log(...args);
	}

	deprecated(...args) {
		if (this.isVerbose("deprecated")) {
			console.log(this.getPrefix("Deprecation"), ...args);
		}
	}

	log(...args) {
		if (this.isVerbose("log")) {
			console.log(this.getPrefix(), ...args);
		}
	}

	debug(...args) {
		console.debug(this.getPrefix(), ...args);
	}

	info(...args) {
		if (this.isVerbose("info")) {
			console.info(this.getPrefix(), ...args);
		}
	}

	warn(...args) {
		if (this.isVerbose("warn")) {
			console.warn(this.getPrefix(), ...args);
		}
	}

	error(...args) {
		if (this.isVerbose("error")) {
			console.error(this.getPrefix(), ...args);
		}
	}

	table(...args) {
		console.table(...args);
	}

	time(...args) {
		console.time(...args);
	}

	timeEnd(...args) {
		console.timeEnd(...args);
	}

	timeLog(...args) {
		console.timeLog(...args);
	}

	trace(...args) {
		console.trace(...args);
	}
}

module.exports = Logger;

const SPACER = ", ";

const LEVELS = [
	"info",
	"log",
	"deprecated",
	"warn",
	"error",
	"disable",
];

class Logger {
	constructor(namespace = null) {
		this._namespace = namespace;
		this._verbose = {};
	}

	typeOf(...args) {
		return args.map(arg => {
			if (arg && typeof arg === "object") {
				return "Type " + typeof arg + " / Class " + arg.constructor.name + " given";
			}
			return "Type " + typeof arg + " given";
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
		if (this._namespace) {
			return this._namespace + " " + level + ": ";
		}
		return level + ": ";
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
			console.log(this.getPrefix("Log"), ...args);
		}
	}

	debug(...args) {
		console.log(this.getPrefix("Debug"), ...args);
	}

	info(...args) {
		if (this.isVerbose("info")) {
			console.info(this.getPrefix("Info"), ...args);
		}
	}

	warn(...args) {
		if (this.isVerbose("warn")) {
			console.warn(this.getPrefix("Warn"), ...args);
		}
	}

	error(...args) {
		if (this.isVerbose("error")) {
			console.error(this.getPrefix("Error"), ...args);
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

const { IN_RULE, MERGE_RULE, OUT_RULE } = require("../constant");

class Processor {
	constructor() {
		this.rule = null;
		this.outData = null;
		this.inData = null;
	}

	use(rule) {
		this.rule = rule;
		if (this.isReadyToProcess()) {
			return this.process();
		}
		return this;
	}

	to(outData) {
		this.outData = outData;
		if (this.isReadyToProcess()) {
			return this.process();
		}
		return this;
	}

	from(inData) {
		this.inData = inData;
		if (this.isReadyToProcess()) {
			return this.process();
		}
		return this;
	}

	validate() {
		return true;
	}

	isReadyToProcess() {
		if (this.rule) {
			if (this.rule.type === MERGE_RULE && this.outData && this.inData) {
				return true;
			}
			if (this.rule.type === IN_RULE && this.outData) {
				return true;
			}
			if (this.rule.type === OUT_RULE && this.outData) {
				return true;
			}
		}
		return false;
	}

	process() {
		if (this.rule.type === MERGE_RULE) {
			return this.processMergeRule();
		}
		if (this.rule.type === IN_RULE) {
			return this.processInRule();
		}
		if (this.rule.type === OUT_RULE) {
			return this.processOutRule();
		}
		throw new Error("Invalid rule type: " + this.rule.type);
	}

	processInRule() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}

	processMergeRule() {
		return new Promise(async (resolve, reject) => {
			resolve();
		});
	}

	processOutRule() {
		return new Promise(async (resolve, reject) => {
			resolve();
		});
	}
}

module.exports = Processor;

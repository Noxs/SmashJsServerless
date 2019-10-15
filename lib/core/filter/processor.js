const { IN_RULE, MERGE_RULE, OUT_RULE } = require("./constant");
const RuleProcessor = require("./ruleProcessor");

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

	validate(type, rule) {
		const ruleProcessor = new RuleProcessor(type);
		return ruleProcessor.validate(rule);
	}

	isReadyToProcess() {
		if (this.rule) {
			if (this.rule._currentConfig.type === MERGE_RULE && this.outData && this.inData) {
				return true;
			}
			if (this.rule._currentConfig.type === IN_RULE && this.outData) {
				return true;
			}
			if (this.rule._currentConfig.type === OUT_RULE && this.outData) {
				return true;
			}
		}
		return false;
	}

	process() {
		if (this.rule._currentConfig.type === IN_RULE) {
			return this.processInRule(IN_RULE);
		}
		if (this.rule._currentConfig.type === MERGE_RULE) {
			return this.processMergeRule(MERGE_RULE);
		}
		if (this.rule._currentConfig.type === OUT_RULE) {
			return this.processOutRule(OUT_RULE);
		}
		throw new Error("Invalid rule type: " + this.rule.type);
	}

	processInRule(type) {
		return new Promise((resolve, reject) => {
			const ruleProcessor = new RuleProcessor(type);
			ruleProcessor.process(this.rule, this.outData).then(resolve).catch(reject);
		});
	}

	processMergeRule(type) {
		return new Promise(async (resolve, reject) => {
			try {
				const [outData] = await Promise.all([
					//mergeRuleProcessor.processProperties(this.rule, this.outData, this.inData),
				]);
				resolve(outData);
			} catch (error) {
				reject(error);
			}
		});
	}

	processOutRule(type) {
		return new Promise(async (resolve, reject) => {
			try {
				const [body] = await Promise.all([
					//outRuleProcessor.processBody(this.rule, this.outData),
				]);
				resolve(body);
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = Processor;

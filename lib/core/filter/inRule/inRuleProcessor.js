const Queue = require("../util/queue");
const ModuleLoader = require("../util/moduleLoader");
const { NONE, IN_RULE } = require("../constant");

class RuleProcessor extends ModuleLoader {
	constructor(config) {
		super(__dirname + "/actions");
		this.config = config;
	}

	applyConfig(rule) {
		if (this.config) {
			Object.defineProperty(rule, "_currentConfig", {
				enumerable: false,
				configurable: true,
				writable: true,
				value: { ...this.config, IN_RULE },
			});
		}
		return rule;
	}

	validate(rule) {
		this.applyConfig(rule);
		for (const key in rule) {
			const moduleToExecute = this.getModuleByName(key);
			moduleToExecute.validate({
				current: { name: key, value: rule[key] },
				parents: [{ name: NONE, value: rule }],
				rule,
				processor: this,
				ruleConfig: rule._currentConfig,
			});
		}
		return this;
	}

	process(rule, data) {
		return new Promise((resolve, reject) => {
			this.applyConfig(rule);
			const queue = new Queue();
			for (const key in rule) {
				const action = this.getModuleByName(key);
				queue.add(action, {
					rule: {
						current: { name: key, value: rule[key] },
						parents: [{ name: NONE, value: rule }],
						initialRule: rule,
						processor: this,
						ruleConfig: rule._currentConfig,
					},
					data: {
						initialData: data,
						current: { name: key, value: data[key] },
						parents: [{ name: NONE, value: data }],
					},
				});
			}
			queue.start().then(() => {
				resolve(data);
			}).catch(reject);
		});
	}
}

module.exports = RuleProcessor;

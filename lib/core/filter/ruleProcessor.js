const Queue = require("./util/queue");
const ModuleLoader = require("./util/moduleLoader");
const { NONE } = require("./constant");

class RuleProcessor extends ModuleLoader {
	constructor(type) {
		super(__dirname + "/" + type + "/actions");
	}

	validate(rule) {
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

const ModuleLoader = require("../util/moduleLoader");
const { unexpectedError } = require("../util/ruleUtil");

class RuleProcessor extends ModuleLoader {
	constructor() {
		super(__dirname + "/actions");
	}

	validate(newRule) {
		const rule = { current: newRule, ruleConfig: newRule._currentConfig, parents: [] };
		if (!rule.current) {
			throw unexpectedError(rule);
		}
		const type = this.identify(rule);
		type.validate({ ...rule, processor: this });
		return true;
	}

	identify({ current, ruleConfig, parents }) {
		const type = this.modules.find(action => action.identify({ current, ruleConfig, parents }));
		if (type === undefined) {
			throw unexpectedError({ current, ruleConfig, parents });
		}
		return type;
	}

	executeNext({ rule, data, context }) {
		const type = this.identify({ current: rule.current, ruleConfig: rule.ruleConfig });
		return type.execute({ rule, data, processor: this, context });
	}

	process(rule, data, context) {
		return new Promise((resolve, reject) => {
			try {
				const type = this.identify({ current: rule, ruleConfig: rule._ruleConfig });
				type.execute({ rule: { current: rule }, data: { current: data }, processor: this, context }).then(customReturn => {
					if (customReturn === undefined) {
						customReturn = {};
					}
					resolve(customReturn);
				}).catch(reject);
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = RuleProcessor;

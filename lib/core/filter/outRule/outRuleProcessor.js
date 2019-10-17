const filterOut = require("./filterOut");

class RuleProcessor {
	validate(rule) {
		filterOut.validate({ current: rule, ruleConfig: rule._currentConfig });
		return this;
	}

	process(rule, data) {
		return new Promise((resolve, reject) => {
			try {
				resolve(filterOut.execute({ rule: { current: rule, ruleConfig: rule._currentConfig }, data: { current: data } }));
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = RuleProcessor;

class RuleProcessor {
	validate(rule, ruleConfig) {
		return this;
	}

	process(rule, request) {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
	}
}

module.exports = RuleProcessor;

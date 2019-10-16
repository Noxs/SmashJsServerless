const { IN_RULE, MERGE_RULE, OUT_RULE, TYPE } = require("./constant");
const Processor = require("./processor");


class Filter {
	constructor() {
		this.rules = {};
		this.currentConfig = null;
	}

	for(currentConfig) {
		this.currentConfig = currentConfig;
		return this;
	}

	_applyCurrentConfig(type, rule) {
		Object.defineProperty(rule, "_currentConfig", {
			enumerable: false,
			configurable: true,
			writable: true,
			value: { ...this.currentConfig, type },
		});
		return rule;
	}

	inRule(inRule) {
		this._registerRule(IN_RULE, inRule);
		return this;
	}

	mergeRule(mergeRule) {
		this._registerRule(MERGE_RULE, mergeRule);
		return this;
	}

	outRule(outRule) {
		this._registerRule(OUT_RULE, outRule);
		return this;
	}

	_registerRule(type, ruleToRegister) {
		const rule = this._applyCurrentConfig(type, ruleToRegister);
		const processor = new Processor();
		processor.validate(type, rule);
		let tree = this.rules;
		const keys = Object.keys(rule._currentConfig).sort();
		keys.forEach(key => {
			tree = this._createKeyIfNotExist(tree, key, rule._currentConfig[key]);
		});
		if (Object.keys(tree).length > 0) {
			throw new Error("Fobidden to register rule for security reason. You must add these keys in rules: " + Object.keys(tree).join(", "));
		} else if (tree.rule) {
			throw new Error("Rule " + JSON.stringify(rule) + " already exist.");
		} else {
			tree.rule = rule;
		}
		return this;
	}

	_createKeyIfNotExist(item, key, value) {
		if (!item[key]) {
			item[key] = {};
		}
		if (!item[key][value]) {
			item[key][value] = {};
		}
		return item[key][value];
	}

	hasInRule(rule) {
		if (this.getMatchingRule({ ...rule, type: IN_RULE })) {
			return true;
		}
		return false;
	}

	hasMergeRule(rule) {
		if (this.getMatchingRule({ ...rule, type: MERGE_RULE })) {
			return true;
		}
		return false;
	}

	hasOutRule(rule) {
		if (this.getMatchingRule({ ...rule, type: OUT_RULE })) {
			return true;
		}
		return false;
	}

	getMatchingRule(rule) {
		const keys = Object.keys(rule).sort();
		let tree = this.rules;
		keys.forEach(key => {
			if (tree[key] && rule[key] && tree[key][rule[key]]) {
				tree = tree[key][rule[key]];
			}
		});
		if (Object.keys(tree).length === 1 && tree.rule) {
			return tree.rule;
		}
		return null;
	}

	cleanIn(rule, data) {
		return new Promise((resolve, reject) => {
			try {
				const ruleToMatch = { ...rule, type: IN_RULE };
				const matchingRule = this.getMatchingRule(ruleToMatch);
				if (matchingRule) {
					const processor = new Processor();
					processor.use(matchingRule).to(data).then(resolve).catch(reject);
				} else {
					reject(new Error("No in rule for: " + JSON.stringify(ruleToMatch)));
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	merge(rule, target, source) {
		return new Promise(async (resolve, reject) => {
			try {
				const matchingRule = this.getMatchingRule({ ...rule, type: MERGE_RULE });
				if (matchingRule) {
					const processor = new Processor();
					const mergedItem = await processor.use(matchingRule).to(target).from(source);
					resolve(mergedItem);
				} else {
					reject(new Error("No merge rule for: " + JSON.stringify(rule)));
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	cleanOut(rule, body) {
		return new Promise(async (resolve, reject) => {
			try {
				const matchingRule = this.getMatchingRule({ ...rule, type: OUT_RULE });
				if (matchingRule) {
					const processor = new Processor();
					const modifiedBody = await processor.use(matchingRule).to(body);
					resolve(modifiedBody);
				} else {
					reject(new Error("No out rule found for: " + JSON.stringify(rule)));
				}
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = Filter;

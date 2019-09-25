const _ = require('lodash');

const WAY = {
    REQUIRED: "required",
    UPDATE: "update",
    CLEAN: "clean",
};

const KEY = {
    NAME: "name",
    MODE: "mode",
    PROPERTY_LIST: "property_list",
    REQUIRED: "required",
    TYPE: "type",
    MIN_VALUE: "min_value",
    MAX_VALUE: "max_value",
    MATCH: "match",
    OPTIONAL: "optional",
    CLEAN_EXTRA_PROPERTY: "clean_extra_property",
};

const defaultIntegerType = {
    verify: Number.isInteger,
    checkMinValue: (value, ruleMinValue) => value >= ruleMinValue,
    checkMaxValue: (value, ruleMaxValue) => value <= ruleMaxValue,
}

const TYPES = {
    "number": Object.assign(defaultIntegerType, {
        verify: !isNaN(value)
    }),
    "integer": defaultIntegerType,
    "string": {
        verify: value => typeof value === "string",
        match: (value, expression) => {
            const regexp = new RegExp(expression);
            return regexp.test(value);
        }
    },
    "unsigned integer": Object.assign(defaultIntegerType, {
        verify: value => Number.isInteger(value) === true && Number(value)
    }),
    "boolean": {
        verify: value => typeof value === "boolean",
    },
    "array": {
        verify: value => Array.isArray(value),
    },
    "object": {
        verify: value => typeof value === "object" && Array.isArray(value) === false,
    },
};

const MODE = {
    RESTRICTIVE: "restrictive",
    PERMISSIVE: "permissive",
};

const ERRORS = {
    MISSING: "missing",
    TYPE: "type",
    RANGE: "range",
    MATCH: "match",
};

class UnknownRuleError extends Error {
    constructor(name) {
        super("Unknown rule " + name);
    }
}

class UnknownWayError extends Error {
    constructor(way) {
        super("Unknown way " + way + ", valid way are " + WAY.REQUIRED + " or " + WAY.CLEAN + " or " + WAY.UPDATE);
    }
}

class UnknownModeError extends Error {
    constructor(mode) {
        super("Unknown mode " + mode + ", valid mode are " + MODE.RESTRICTIVE + " or " + MODE.PERMISSIVE);
    }
}

class AlreadyExistError extends Error {
    constructor(name) {
        super("Rule " + name + " is already defined");
    }
}

class MissingPropertyError extends Error {
    constructor(name) {
        super("Missing property " + name);
    }
}

class BadParameterError extends Error {
    constructor(message, object) {
        super(message + ", " + typeof object + " given");
    }
}

class InvalidTypeError extends Error {
    constructor(type) {
        super("Invalid type " + type + ", available types are: " + Object.keys(TYPES).join(', '));
    }
}

class Binder {
    constructor() {
        this._requiredConfiguration = {};
        this._updateConfiguration = {};
        this._cleanConfiguration = {};
    }

    _addToArray(object, array) {
        if (Array.isArray(array) !== true) {
            throw new BadParameterError("Second parameter of _addToArray(mixed, array) must be an array", array);
        }
        if (Array.isArray(object) === true) {
            for (let i = 0, length = object.length; i < length; i++) {
                array.push(object[i]);
            }
        } else if (object !== undefined) {
            array.push(object);
        }
        return array;
    }

    _checkRuleNameUniqness(rule, configuration) {
        if (!(KEY.NAME in rule)) {
            throw new MissingPropertyError(KEY.NAME);
        }
        if (rule.name in configuration) {
            throw new AlreadyExistError(rule.name);
        }
        return this;
    }

    _registerRequiredRule(rule) {
        this._checkRuleNameUniqness(rule, this._requiredConfiguration);
        if (!(KEY.REQUIRED in rule)) {
            throw new MissingPropertyError(KEY.REQUIRED);
        }
        for (let keyList in rule[KEY.REQUIRED]) {
            if (rule[KEY.REQUIRED][keyList][KEY.TYPE] !== undefined && TYPES[rule[KEY.REQUIRED][keyList][KEY.TYPE]] === undefined) {
                throw new InvalidTypeError(rule[KEY.REQUIRED][keyList][KEY.TYPE]);
            }
        }
        if (!(KEY.CLEAN_EXTRA_PROPERTY in rule)) {
            rule[KEY.CLEAN_EXTRA_PROPERTY] = true;
        }
        this._requiredConfiguration[rule[KEY.NAME]] = rule;
        return this;
    }

    _registerUpdateRule(rule) {
        this._checkRuleNameUniqness(rule, this._updateConfiguration);
        if (!(KEY.MODE in rule)) {
            throw new MissingPropertyError(KEY.MODE);
        }
        if (rule.mode !== MODE.RESTRICTIVE && rule.mode !== MODE.PERMISSIVE) {
            throw new UnknownModeError(rule.mode);
        }
        if (!(KEY.PROPERTY_LIST in rule)) {
            throw new MissingPropertyError(KEY.PROPERTY_LIST);
        }
        this._updateConfiguration[rule[KEY.NAME]] = rule;
        return this;
    }

    _registerCleanRule(rule) {
        this._checkRuleNameUniqness(rule, this._cleanConfiguration);
        if (!(KEY.MODE in rule)) {
            throw new MissingPropertyError(KEY.MODE);
        }
        if (rule.mode !== MODE.RESTRICTIVE && rule.mode !== MODE.PERMISSIVE) {
            throw new UnknownModeError(rule.mode);
        }
        if (!(KEY.PROPERTY_LIST in rule)) {
            throw new MissingPropertyError(KEY.PROPERTY_LIST);
        }
        this._cleanConfiguration[rule[KEY.NAME]] = rule;
        return this;
    }

    registerRequiredRule(rule) {
        if (typeof rule !== 'object') {
            throw new BadParameterError("First parameter of registerRule(rule) must be an object", rule);
        }
        rule.way = WAY.REQUIRED;
        this.registerRule(rule);
        return this;
    }

    registerMergeRule() {
        return this.registerUpdateRule.apply(this, arguments);
    }

    registerUpdateRule(rule) {
        if (typeof rule !== 'object') {
            throw new BadParameterError("First parameter of registerRule(rule) must be an object", rule);
        }
        rule.way = WAY.UPDATE;
        this.registerRule(rule);
        return this;
    }

    registerCleanRule(rule) {
        if (typeof rule !== 'object') {
            throw new BadParameterError("First parameter of registerRule(rule) must be an object", rule);
        }
        rule.way = WAY.CLEAN;
        this.registerRule(rule);
        return this;
    }

    registerRule(rule) {
        if (typeof rule !== 'object') {
            throw new BadParameterError("First parameter of registerRule(rule) must be an object", rule);
        }
        if (rule.way === WAY.REQUIRED) {
            this._registerRequiredRule(rule);
        } else if (rule.way === WAY.UPDATE) {
            this._registerUpdateRule(rule);
        } else if (rule.way === WAY.CLEAN) {
            this._registerCleanRule(rule);
        } else {
            throw new UnknownWayError(rule.way);
        }
        return this;
    }

    requiredRuleExist(name) {
        return Boolean(name in this._requiredConfiguration);
    }

    hasRequired(name, data) {
        if (!(name in this._requiredConfiguration)) {
            throw new UnknownRuleError(name);
        }
        const rule = this._requiredConfiguration[name];
        const list = rule[KEY.REQUIRED];
        const errors = [];
        const inputArray = [];
        if (!data) {
            data = {};
        }
        this._addToArray(data, inputArray);
        for (let i = 0, length = inputArray.length; i < length; i++) {
            const data = inputArray[i];
            if (rule[KEY.CLEAN_EXTRA_PROPERTY] === true) {
                for (let key in data) {
                    if (!(key in list)) {
                        delete data[key];
                    }
                }
            }
            for (let keyList in list) {
                if (!(keyList in data) && !(list[keyList][KEY.OPTIONAL] === true)) {
                    if (rule[KEY.OPTIONAL] === undefined || rule[KEY.OPTIONAL] !== true) {
                        errors.push({ type: ERRORS.MISSING, name: keyList });
                    }
                } else {
                    if ((keyList in data)) {
                        if (KEY.TYPE in list[keyList]) {
                            const type = list[keyList][KEY.TYPE];
                            if (type in TYPES) {
                                if (TYPES[type].verify(data[keyList]) === false) {
                                    errors.push({ type: ERRORS.TYPE, name: keyList, given: data[keyList], expected: type });
                                }
                                if (typeof TYPES[type].match === 'function' && list[keyList][KEY.MATCH] !== undefined) {
                                    if (TYPES[type].match(data[keyList], list[keyList][KEY.MATCH]) === false) {
                                        errors.push({ type: ERRORS.MATCH, name: keyList });
                                    }
                                }
                                if (typeof TYPES[type].checkMinValue === 'function' && list[keyList][KEY.MIN_VALUE] !== undefined) {
                                    if (TYPES[type].checkMinValue(data[keyList], list[keyList][KEY.MIN_VALUE]) === false) {
                                        errors.push({ type: ERRORS.RANGE, name: keyList });
                                    }
                                }
                                if (typeof TYPES[type].checkMaxValue === 'function' && list[keyList][KEY.MAX_VALUE] !== undefined) {
                                    if (TYPES[type].checkMaxValue(data[keyList], list[keyList][KEY.MAX_VALUE]) === false) {
                                        errors.push({ type: ERRORS.RANGE, name: keyList });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (errors.length !== 0)
            return errors;
        else
            return true;
    }

    mergeObject(name, newData, currentData = {}) {
        if (!(name in this._updateConfiguration))
            throw new UnknownRuleError(name);
        const dataToUpdate = this._getObjectDataByMode(this._updateConfiguration, name, newData);
        return Object.assign({}, currentData, dataToUpdate);
    }

    update(name, newData, currentData) {
        if (!(name in this._updateConfiguration))
            throw new UnknownRuleError(name);
        if (_.isArray(newData)) {
            const arrayCurrentData = _.concat([], currentData);
            const arrayNewData = _.concat([], newData);
            return arrayNewData.map((newData, i) => this.mergeObject(name, newData, arrayCurrentData[i]));
        }
        return this.mergeObject(name, newData, currentData);
    }

    clean(name, collection) {
        if (!(name in this._cleanConfiguration))
            throw new UnknownRuleError(name);
        return _.map(_.concat([], collection), _.bind(this._getObjectDataByMode, this, this._cleanConfiguration, name));
    }

    _getObjectDataByMode(conf, name, object) {
        const rule = conf[name];
        const list = rule[KEY.PROPERTY_LIST];
        return rule.mode === MODE.PERMISSIVE ? _.omit(object, list) : _.pick(object, list);
    }

    _getPropertyList(name) {
    }

    cleanRuleExist(name) {
        return Boolean(name in this._cleanConfiguration);
    }

    get UnknownWayError() {
        return UnknownWayError;
    }

    get UnknownModeError() {
        return UnknownModeError;
    }

    get AlreadyExistError() {
        return AlreadyExistError;
    }

    get MissingPropertyError() {
        return MissingPropertyError;
    }

    get UnknownRuleError() {
        return UnknownRuleError;
    }

    get BadParameterError() {
        return BadParameterError;
    }

    get InvalidTypeError() {
        return InvalidTypeError;
    }

    get Errors() {
        return ERRORS;
    }

}

module.exports = Binder;

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
    TYPES: "types",
    RANGE_MIN: "range_min",
    RANGE_MAX: "range_max",
    MATCH: "match"
};

const MODE = {
    RESTRICTIVE: "restrictive",
    PERMISSIVE: "permissive"
};

const ERRORS = {
    MISSING: "missing",
    TYPE: "type",
    RANGE: "range",
    MATCH: "match"
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
        this._requiredConfiguration[rule[KEY.NAME]] = rule;
        return this;
    }

    _registerUpdateRule(rule) {
        this._checkRuleNameUniqness(rule, this._requiredConfiguration);
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

    hasRequired(name, data) {
        if (!(name in this._requiredConfiguration)) {
            throw new UnknownRuleError(name);
        }
        const rule = this._requiredConfiguration[name];
        const list = rule[KEY.REQUIRED];
        const errors = [];
        const inputArray = [];
        this._addToArray(data, inputArray);
        for (let i = 0, length = inputArray.length; i < length; i++) {
            const data = inputArray[i];
            for (let keyList in list) {
                if (!(keyList in data)) {
                    errors.push({ type: ERRORS.MISSING, name: keyList });
                } else {
                    //TODO
                    //keep this parameters optionnal
                    //missingParameters.push({ type: ERRORS.TYPE, name: list[j][KEY.NAME] });
                    //missingParameters.push({ type: ERRORS.RANGE, name: list[j][KEY.NAME] });
                    //missingParameters.push({ type: ERRORS.MATCH, name: list[j][KEY.NAME] });
                }
            }
        }
        if (errors.length !== 0) {
            return errors;
        } else {
            return true;
        }
    }

    update(name, newData, currentData) {
        if (!(name in this._updateConfiguration)) {
            throw new UnknownRuleError(name);
        }

        const rule = this._updateConfiguration[name];
        const list = rule[KEY.PROPERTY_LIST];
        const newArray = [];
        const currentArray = [];
        this._addToArray(newData, newArray);
        this._addToArray(currentData, currentArray);

        //TODO check if newArray < currentArray
        //throw an error about undefined behavior
        while (currentArray.length < newArray.length) {
            currentArray.push({});
        }

        for (let i = 0, length = newArray.length; i < length; i++) {
            const source = newArray[i];
            const target = currentArray[i];
            for (let keySource in source) {
                if (rule.mode === MODE.RESTRICTIVE) {
                    if (list.indexOf(keySource) !== -1) {
                        target[keySource] = source[keySource];
                    }
                } else if (rule.mode === MODE.PERMISSIVE) {
                    if (list.indexOf(keySource) === -1) {
                        target[keySource] = source[keySource];
                    }
                }
            }
        }
        if (Array.isArray(newData) === true || Array.isArray(currentData) === true) {
            return currentArray;
        } else {
            return currentArray.shift();
        }
    }

    clean(name, object) {
        if (!(name in this._cleanConfiguration)) {
            throw new UnknownRuleError(name);
        }
        const rule = this._cleanConfiguration[name];
        const list = rule[KEY.PROPERTY_LIST];
        const cleanArray = [];
        const inputArray = [];
        this._addToArray(object, inputArray);
        for (let i = 0, length = inputArray.length; i < length; i++) {
            const oldObject = inputArray[i];
            const newObject = {};
            if (rule.mode === MODE.PERMISSIVE) {
                for (let key in oldObject) {
                    newObject[key] = oldObject[key];
                }
            }
            for (let key in list) {
                if (rule.mode === MODE.RESTRICTIVE) {
                    if (list[key] in oldObject) {
                        newObject[list[key]] = oldObject[list[key]];
                    }
                } else if (rule.mode === MODE.PERMISSIVE) {
                    delete newObject[list[key]];
                }
            }
            cleanArray.push(newObject);
        }
        return cleanArray;
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

    get Errors() {
        return ERRORS;
    }

}

module.exports = Binder;
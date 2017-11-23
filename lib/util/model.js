const Console = require('./console.js');

class Model extends Console {
    constructor() {
        super();
        if (this.constructor === Model) {
            throw new Error("Model is an abstract class, you must extend it from another class like class Foobar extends Model {}");
        }
    }

    /*
     * Copy and clean object exclusing properties given by updateExclusion()
     * 
     * @param {object} source
     * @param {object} target
     * @returns {object}
     */
    update(source, target) {
        if (target === undefined) {
            target = {};
        }
        if (typeof source !== 'object') {
            throw new Error("First parameter of updateExclusion() must be an object, " + this.typeOf(source) + " provided");
        }
        if (typeof target !== 'object') {
            throw new Error("Second parameter of updateExclusion() must be an object, " + this.typeOf(source) + " provided");
        }
        if (typeof this.updateExclusion !== 'function') {
            throw new Error("Missing function updateExclusion() in " + this.constructor.name);
        }
        const excluded = this.updateExclusion();
        if (Array.isArray(excluded) === false) {
            throw new Error("Function updateExclusion() must return an array, " + this.typeOf(excluded) + " provided");
        }
        for (var sourceKey in source) {
            let found = false;
            for (let i = 0, length = excluded.length; i < length; i++) {
                if (sourceKey === excluded[i]) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                if (source[sourceKey] === null) {
                    delete target[sourceKey];
                } else if (source[sourceKey] === "") {
                    target[sourceKey] = null;
                } else {
                    target[sourceKey] = source[sourceKey];
                }
            }
        }
        return target;
    }

    /*
     * Make a copy of the source object and remove properties given by cleanInclusion()
     * 
     * @param {object} source
     * @returns {object}
     */
    clean(source) {
        const target = Object.assign({}, source);
        if (typeof target !== 'object') {
            throw new Error("First parameter of cleanInclusion() must be an object, " + this.typeOf(target) + " provided");
        }
        if (typeof this.cleanInclusion !== 'function') {
            throw new Error("Missing function cleanInclusion() in " + this.constructor.name);
        }
        const excluded = this.cleanInclusion();
        if (Array.isArray(excluded) === false) {
            throw new Error("Function cleanInclusion() must return an array, " + this.typeOf(excluded) + " provided");
        }
        for (let i = 0, length = excluded.length; i < length; i++) {
            if (target[excluded[i]]) {
                delete target[excluded[i]];
            }
        }
        return target;
    }

    /**
     * 
     * Check if object has required properties given by required()
     * 
     * @param {type} object
     * @returns {Boolean}
     */
    hasRequired(object) {
        if (typeof object !== "object") {
            throw new Error("First parameter of hasRequired() must be an object, " + this.typeOf(object) + " provided");
        }
        if (typeof this.required !== 'function') {
            throw new Error("Missing function required() in " + this.constructor.name);
        }
        const required = this.required();
        if (Array.isArray(required) === false) {
            throw new Error("Function required() must return an array, " + this.typeOf(required) + " provided");
        }
        for (let i = 0, length = required.length; i < length; i++) {
            if (object[required[i]] === undefined) {
                return false;
            }
        }
        return true;
    }

}

module.exports = Model;


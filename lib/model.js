class Model {

    constructor() {
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
            throw new Error("First parameter of updateExclusion() must be an object, " + typeof source + " provided");
        }
        if (typeof target !== 'object') {
            throw new Error("Second parameter of updateExclusion() must be an object, " + typeof target + " provided");
        }
        if (typeof this.updateExclusion !== 'function') {
            throw new Error("Missing function updateExclusion() in " + this.constructor.name);
        }
        const excluded = this.updateExclusion();
        if (Array.isArray(excluded) === false) {
            throw new Error("Function updateExclusion() must return an array, " + typeof excluded + " provided");
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
                    console.log(source[sourceKey], target[sourceKey]);
                } else {
                    target[sourceKey] = source[sourceKey];
                }
            }
        }
        return target;
    }

    /*
     * Make a copy of the source objectand remove properties given by cleanInclusion()
     * 
     * @param {object} source
     * @returns {object}
     */
    clean(source) {
        const target = Object.assign({}, source);
        if (typeof target !== 'object') {
            throw new Error("First parameter of cleanInclusion() must be an object, " + typeof target + " provided");
        }
        if (typeof this.cleanInclusion !== 'function') {
            throw new Error("Missing function cleanInclusion() in " + this.constructor.name);
        }
        const excluded = this.cleanInclusion();
        if (Array.isArray(excluded) === false) {
            throw new Error("Function cleanInclusion() must return an array, " + typeof excluded + " provided");
        }
        for (let i = 0, length = excluded.length; i < length; i++) {
            if (target[excluded[i]]) {
                delete target[excluded[i]];
            }
        }
        return target;
    }

}

module.exports = Model;


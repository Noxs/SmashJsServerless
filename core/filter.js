var smash = require("../smash.js");
function Filter() {
    var that = this;
    that.filterInput = function (databaseData, extData, databaseObject) {
        if (databaseObject.getInputFilters && typeof databaseObject.getInputFilters === 'function' && databaseData && typeof databaseData === 'object' && extData && typeof extData === 'object') {
            var filters = databaseObject.getInputFilters();
            for (var keyExtData in extData) {
                var found = false;
                for (var keyFilter in filters) {
                    if (keyExtData === filters[keyFilter]) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    if (extData[keyExtData] === null) {
                        delete databaseData[keyExtData];
                    } else if (extData[keyExtData] === "") {
                        databaseData[keyExtData] = null;
                    } else {
                        databaseData[keyExtData] = extData[keyExtData];
                    }
                }
            }
        } else {
            if (smash.debugIsActive()) {
                smash.getLogger().log("Filter input failed.");
            }
            if (!databaseData || typeof databaseData !== 'object') {
                if (smash.debugIsActive()) {
                    smash.getLogger().log("Required first parameter to be an object.");
                }
            }
            if (!extData || typeof extData !== 'object') {
                if (smash.debugIsActive()) {
                    smash.getLogger().log("Required second parameter to be an object.");
                }
            }
            if (!databaseObject.getInputFilters || typeof databaseObject.getInputFilters !== 'function') {
                if (smash.debugIsActive()) {
                    smash.getLogger().log("Required getInputFilters function in the third parameter.");
                }
            }
        }
        return databaseData;
    };
    that.filterOutput = function (data, databaseObject) {
        if (databaseObject.getOutputFilters && typeof databaseObject.getOutputFilters === 'function' && data && typeof data === 'object') {
            var filters = databaseObject.getOutputFilters();
            for (var keyData in data) {
                var found = false;
                for (var keyFilter in filters) {
                    if (keyData === filters[keyFilter]) {
                        found = true;
                        break;
                    }
                }
                if (found === true) {
                    delete data[keyData];
                }
            }
        } else {
            if (smash.debugIsActive()) {
                smash.getLogger().log("Filter output failed.");
            }
            if (!data || typeof data !== 'object') {
                if (smash.debugIsActive()) {
                    smash.getLogger().log("Required first parameter to be an object.");
                }
            }
            if (!databaseObject.getOutputFilters || typeof databaseObject.getOutputFilters !== 'function') {
                if (smash.debugIsActive()) {
                    smash.getLogger().log("Required getOutputFilters function in the second parameter.");
                }
            }
        }
        return data;
    };
}

module.exports = {
    build: function () {
        if (smash.getFilter() === null) {
            smash.registerFilter(new Filter());
        }
        return smash.getFilter();
    },
    get: function () {
        return smash.getFilter();
    }
};
const MatchPrefix = require('./regexp');
const Uppercase = require('./firstLetterUppercase');

class DatabaseConfigBuilder {
    constructor(tableDescription) {
        this._tableDescription = tableDescription;
        this._transformedDescription = {};
    }

    _capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    _isSortKey(keyType) {
        if (keyType === "RANGE") {
            return true;
        }
        return false;
    }

    _isPartitionKey(keyType) {
        if (keyType === "HASH") {
            return true;
        }
        return false;
    }

    _parseKey(key) {
        let parsedKey = {};
        if (this._isSortKey(key.KeyType)) {
            parsedKey.sortKey = key.AttributeName;
        }
        if (this._isPartitionKey(key.KeyType)) {
            parsedKey.partitionKey = key.AttributeName;
        }
        return parsedKey;
    }

    _parseKeySchema(keySchema) {
        let parsedKeySchema = {};
        if (keySchema.length !== 0) {
            keySchema.forEach(key => {
                let parsedKey = this._parseKey(key);
                if (parsedKey.partitionKey) {
                    parsedKeySchema.partitionKey = parsedKey.partitionKey;
                };
                if (parsedKey.sortKey) {
                    parsedKeySchema.sortKey = parsedKey.sortKey;
                }
            })
        }
        return parsedKeySchema;
    }

    _parsePrimaryIndex() {
        this._transformedDescription.primaryIndex = {};
        if (this._tableDescription.KeySchema.length === 1) {
            const parsedSchema = this._parseKeySchema(this._tableDescription.KeySchema);
            this._transformedDescription.primaryIndex.partitionKey = parsedSchema.partitionKey;
            this._transformedDescription.primaryIndex.indexName = parsedSchema.partitionKey;
        } else if (this._tableDescription.KeySchema.length === 2) {
            const parsedSchema = this._parseKeySchema(this._tableDescription.KeySchema);
            this._transformedDescription.primaryIndex.indexName = parsedSchema.partitionKey;
            this._transformedDescription.primaryIndex.partitionKey = parsedSchema.partitionKey;
            this._transformedDescription.primaryIndex.sortKey = parsedSchema.sortKey;
        }
    }

    _parseSecondaryIndex() {
        this._transformedDescription.secondaryIndex = [];
        if (this._tableDescription.GlobalSecondaryIndexes && this._tableDescription.GlobalSecondaryIndexes.length !== 0) {
            this._tableDescription.GlobalSecondaryIndexes.forEach(index => {
                let indexTransformed = {};
                indexTransformed.indexName = index.IndexName;
                if (index.KeySchema.length === 1) {
                    const parsedSchema = this._parseKeySchema(index.KeySchema);
                    indexTransformed.partitionKey = parsedSchema.partitionKey;
                }
                if (index.KeySchema.length === 2) {
                    const parsedSchema = this._parseKeySchema(index.KeySchema);
                    indexTransformed.partitionKey = parsedSchema.partitionKey;
                    indexTransformed.sortKey = parsedSchema.sortKey;
                }
                this._transformedDescription.secondaryIndex.push(indexTransformed);
            });
        }
    }

    get transformedDescription() {
        return this._transformedDescription;
    }


    _translateDescription() {
        this._transformedDescription.table = Uppercase.capitalizeFirstLetter(this._tableDescription.TableName.split("_")[1]);
        //Retrieve suffix 
        this._parsePrimaryIndex();
        this._parseSecondaryIndex();
    }
}

module.exports = DatabaseConfigBuilder;

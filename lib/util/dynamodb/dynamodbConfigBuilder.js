class DynamodbConfigBuilder {
	constructor(prefix, suffix, tableDescription) {
		this._prefix = prefix;
		this._suffix = suffix;
		this._tableDescription = tableDescription;
		this._transformedDescription = {};
	}

	_capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	_computeTableName(name) {
		let parsedName = name.replace(this._prefix + '_', '');
		parsedName = parsedName.replace('_' + this._suffix, '');
		return this._capitalizeFirstLetter(parsedName);
	}

	_isSortKey(keyType) {
		return keyType === "RANGE";
	}

	_isPartitionKey(keyType) {
		return keyType === "HASH";
	}

	_parseKey(key) {
		const parsedKey = {};
		if (this._isSortKey(key.KeyType)) {
			parsedKey.sortKey = key.AttributeName;
		} else if (this._isPartitionKey(key.KeyType)) {
			parsedKey.partitionKey = key.AttributeName;
		}
		return parsedKey;
	}

	_parseKeySchema(keySchema) {
		const parsedKeySchema = {};
		keySchema.forEach(key => {
			const parsedKey = this._parseKey(key);
			if (parsedKey.partitionKey) {
				parsedKeySchema.partitionKey = parsedKey.partitionKey;
			}
			if (parsedKey.sortKey) {
				parsedKeySchema.sortKey = parsedKey.sortKey;
			}
		});
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
				const indexTransformed = {};
				indexTransformed.indexName = index.IndexName;
				if (index.KeySchema.length === 1) {
					const parsedSchema = this._parseKeySchema(index.KeySchema);
					indexTransformed.partitionKey = parsedSchema.partitionKey;
				} else if (index.KeySchema.length === 2) {
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

	transformDescription() {
		this._transformedDescription.table = this._tableDescription.TableName;
		this._transformedDescription.name = this._computeTableName(this._tableDescription.TableName);
		this._parsePrimaryIndex();
		this._parseSecondaryIndex();
	}
}

module.exports = DynamodbConfigBuilder;

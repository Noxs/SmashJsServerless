module.exports = {
    table_names: {
        "TableNames": ['transfer_transfer_dev',
            'transfer_transfer_file_dev',
            'transfer_transfer_filepart_dev']
    },
    table_description: {
        "Table": {
            "AttributeDefinitions": [
                {
                    "AttributeName": "account_legacy",
                    "AttributeType": "N"
                },
                {
                    "AttributeName": "id",
                    "AttributeType": "S"
                },
                {
                    "AttributeName": "report",
                    "AttributeType": "S"
                }
            ],
            "TableName": "transfer_transfer_dev",
            "KeySchema": [
                {
                    "AttributeName": "id",
                    "KeyType": "HASH"
                }
            ],
            "TableStatus": "ACTIVE",
            "CreationDateTime": "2019-05-03T10:35:32.421Z",
            "ProvisionedThroughput": {
                "NumberOfDecreasesToday": 0,
                "ReadCapacityUnits": 0,
                "WriteCapacityUnits": 0
            },
            "TableSizeBytes": 6924,
            "ItemCount": 10,
            "TableArn": "arn:aws:dynamodb:eu-west-1:123456789:table/transfer_transfer_dev",
            "TableId": "49232056-d01a-49d3-8736-8b76508a34ed",
            "BillingModeSummary": {
                "BillingMode": "PAY_PER_REQUEST",
                "LastUpdateToPayPerRequestDateTime": "2019-05-03T10:35:32.421Z"
            },
            "GlobalSecondaryIndexes": [
                {
                    "IndexName": "account_legacy",
                    "KeySchema": [
                        {
                            "AttributeName": "account_legacy",
                            "KeyType": "HASH"
                        }
                    ],
                    "Projection": {
                        "ProjectionType": "ALL"
                    },
                    "IndexStatus": "ACTIVE",
                    "ProvisionedThroughput": {
                        "NumberOfDecreasesToday": 0,
                        "ReadCapacityUnits": 0,
                        "WriteCapacityUnits": 0
                    },
                    "IndexSizeBytes": 3457,
                    "ItemCount": 4,
                    "IndexArn": "arn:aws:dynamodb:eu-west-1:123456789:table/transfer_transfer_dev/index/account_legacy"
                },
                {
                    "IndexName": "report",
                    "KeySchema": [
                        {
                            "AttributeName": "report",
                            "KeyType": "HASH"
                        }
                    ],
                    "Projection": {
                        "ProjectionType": "KEYS_ONLY"
                    },
                    "IndexStatus": "ACTIVE",
                    "ProvisionedThroughput": {
                        "NumberOfDecreasesToday": 0,
                        "ReadCapacityUnits": 0,
                        "WriteCapacityUnits": 0
                    },
                    "IndexSizeBytes": 582,
                    "ItemCount": 10,
                    "IndexArn": "arn:aws:dynamodb:eu-west-1:123456789:table/transfer_transfer_dev/index/report"
                }
            ],
            "StreamSpecification": {
                "StreamEnabled": true,
                "StreamViewType": "NEW_AND_OLD_IMAGES"
            },
            "LatestStreamLabel": "2019-05-09T14:34:56.476",
            "LatestStreamArn": "arn:aws:dynamodb:eu-west-1:123456789:table/transfer_transfer_dev/stream/2019-05-09T14:34:56.476",
            "SSEDescription": {
                "Status": "ENABLED",
                "SSEType": "KMS",
                "KMSMasterKeyArn": "arn:aws:kms:eu-west-1:123456789:key/04bde937-9c03-4415-9b80-aac64c9d1e4b"
            }
        }
    }
}
module.exports = {
    good: {
        'CodePipeline.job':
        {
            id: "31ac5371-3eef-4036-8699-6dfae28a5021",
            accountId: "*",
            data:
            {
                actionConfiguration: {
                        configuration: {}
                },
                inputArtifacts: [],
                outputArtifacts: [],
                artifactCredentials: []
            }
        },
        context:
        {
            callbackWaitsForEmptyEventLoop: [],
            done: [],
            succeed: [],
            fail: [],
            logGroupName: "/aws/lambda/test",
            logStreamName: "2019/06/12/[$LATEST]test",
            functionName: "test",
            memoryLimitInMB: "128",
            functionVersion: "$LATEST",
            getRemainingTimeInMillis: [],
            invokeid: "6e276abb-959b-46ce-a907-7103874a2179",
            awsRequestId: "6e276abb-959b-46ce-a907-7103874a2179",
            invokedFunctionArn: "*:*:function:test"
        },
        _terminate: { _events: [], _callback: [] }
    },
    goodgood: {
        'CodePipeline.job':
        {
            id: "31ac5371-3eef-4036-8699-6dfae28a5021",
            accountId: "*",
            data:
            {
                actionConfiguration: {
                        configuration: {
                        UserParameters : "dataStackDeploy"
                    }
                },
                inputArtifacts: [],
                outputArtifacts: [],
                artifactCredentials: []
            }
        },
        context:
        {
            callbackWaitsForEmptyEventLoop: [],
            done: [],
            succeed: [],
            fail: [],
            logGroupName: "/aws/lambda/test",
            logStreamName: "2019/06/12/[$LATEST]test",
            functionName: "test",
            memoryLimitInMB: "128",
            functionVersion: "$LATEST",
            getRemainingTimeInMillis: [],
            invokeid: "6e276abb-959b-46ce-a907-7103874a2179",
            awsRequestId: "6e276abb-959b-46ce-a907-7103874a2179",
            invokedFunctionArn: "*:*:function:test"
        },
        _terminate: { _events: [], _callback: [] }
    },
    bad: {
        'CodePipeline.job':
        {
            id: "31ac5371-3eef-4036-8699-6dfae28a5021",
            accountId: "*",
            data:
            {
                actionConfiguration: {
                        configuration: {
                            UserParameters : "dataStackFailureDeploy"
                        }
                },
                inputArtifacts: [],
                outputArtifacts: [],
                artifactCredentials: []
            }
        },
        context:
        {
            callbackWaitsForEmptyEventLoop: [],
            done: [],
            succeed: [],
            fail: [],
            logGroupName: "/aws/lambda/test",
            logStreamName: "2019/06/12/[$LATEST]test",
            functionName: "test",
            memoryLimitInMB: "128",
            functionVersion: "$LATEST",
            getRemainingTimeInMillis: [],
            invokeid: "6e276abb-959b-46ce-a907-7103874a2179",
            awsRequestId: "6e276abb-959b-46ce-a907-7103874a2179",
            invokedFunctionArn: "*:*:function:test"
        },
        _terminate: { _events: [], _callback: [] }
    },
    badbad: {
        'CodePipeline.job':
        {
            id: "31ac5371-3eef-4036-8699-6dfae28a5021",
            accountId: "*",
            data:
            {
                actionConfiguration: {
                        configuration: {
                        UserParameters : "dataStackFailureDeploy"
                    }
                },
                inputArtifacts: [],
                outputArtifacts: [],
                artifactCredentials: []
            }
        },
        context:
        {
            callbackWaitsForEmptyEventLoop: [],
            done: [],
            succeed: [],
            fail: [],
            logGroupName: "/aws/lambda/test",
            logStreamName: "2019/06/12/[$LATEST]test",
            functionName: "test",
            memoryLimitInMB: "128",
            functionVersion: "$LATEST",
            getRemainingTimeInMillis: [],
            invokeid: "6e276abb-959b-46ce-a907-7103874a2179",
            awsRequestId: "6e276abb-959b-46ce-a907-7103874a2179",
            invokedFunctionArn: "*:*:function:test"
        },
        _terminate: { _events: [], _callback: [] }
    }
}

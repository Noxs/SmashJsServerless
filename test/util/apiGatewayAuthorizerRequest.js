module.exports = {
    good: {
        type: 'REQUEST',
        methodArn: 'arn:aws:execute-api:eu-west-1:123456789:abcdefghi/ESTestInvoke-stage/GET/',
        resource: '/',
        path: '/',
        httpMethod: 'GET',
        headers: { Authorization: 'Anonymous' },
        multiValueHeaders: { Authorization: ['Anonymous'] },
        queryStringParameters: {},
        multiValueQueryStringParameters: {},
        pathParameters: {},
        stageVariables: {},
        requestContext:
        {
            path: '/',
            accountId: '123456789',
            resourceId: 'test-invoke-resource-id',
            stage: 'test-invoke-stage',
            domainPrefix: 'testPrefix',
            requestId: 'c36744c4-3145-11e9-9d34-df049cd0793a',
            identity:
            {
                cognitoIdentityPoolId: null,
                cognitoIdentityId: null,
                apiKey: 'test-invoke-api-key',
                cognitoAuthenticationType: null,
                userArn: 'arn:aws:iam::123456789:root',
                apiKeyId: 'test-invoke-api-key-id',
                userAgent: 'aws-internal/3 aws-sdk-java/1.11.481 Linux/4.9.137-0.1.ac.218.74.329.metal1.x86_64 OpenJDK_64-Bit_Server_VM/25.192-b12 java/1.8.0_192',
                accountId: '123456789',
                caller: '123456789',
                sourceIp: 'test-invoke-source-ip',
                accessKey: 'ASIAYPP7RU2RPB6BZHNM',
                cognitoAuthenticationProvider: null,
                user: '123456789'
            },
            domainName: 'testPrefix.testDomainName',
            resourcePath: '/',
            httpMethod: 'GET',
            extendedRequestId: 'VJsjQFreDoEFnhg=',
            apiId: 'abcdefghi'
        }
    }
};
import * as cdk from '@aws-cdk/cdk';
import * as iam from '@aws-cdk/aws-iam';
import * as appsync from '@aws-cdk/aws-appsync';
import * as path from 'path';
import { readFileSync } from 'fs';

import IDevLoungeStack from '../interfaces/IDevLoungeStack';

const BASE_DIR = 'dlounge-appsync-server/graphql';
const AWS_REGION = process.env.AWS_REGION || '';
const APPSYNC_NAME = process.env.APPSYNC_NAME || '';

const gqlPath = (folder: string) => path.join('..', BASE_DIR, folder);
const template = (tmplPath: string) => readFileSync(tmplPath).toString();
const resolverPath = gqlPath('resolvers');
const requestTemplate = (resolver: string) => 
    template(path.join(resolverPath, resolver, 'request.vtl'));
const responseTemplate = (resolver: string) => 
    template(path.join(resolverPath, resolver, 'response.vtl'));

const buildApi = (scope: cdk.Construct, userPoolId: string) => {
    const api = new appsync.CfnGraphQLApi(scope, 'DevLoungeQ4AppSync', {
        authenticationType: 'AMAZON_COGNITO_USER_POOLS',
        userPoolConfig: {
            awsRegion: AWS_REGION,
            defaultAction: 'ALLOW',
            userPoolId: userPoolId
    },
        name: APPSYNC_NAME
    });

    return api;
};

const buildSchema = (scope: cdk.Construct, apiId: string) => {
    const schemaPath = path.join('..', BASE_DIR, 'schema.gql');
    const schema = new appsync.CfnGraphQLSchema(scope, 'DevLoungeQ4AppSyncSchema', {
        apiId: apiId,
        definition: template(schemaPath)
    });

    return schema;
};

const buildRole = (scope: cdk.Construct) => {
    const fnRole = new iam.Role(scope, 'appsync_execution_role', {
        assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
        roleName: 'appsync_execution_role',
        managedPolicyArns: [
            'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess',
            'arn:aws:iam::aws:policy/AWSLambdaFullAccess'
        ]
    });
    fnRole.addToPolicy(
        new iam.PolicyStatement()
        .addAllResources()
        .addActions("es:ESHttpPost", "es:ESHttpPut", "es:ESHttpDelete")
    );

    return fnRole;
};

const buildDDBSource = (scope: cdk.Construct, apiId: string, tableName: string, roleArn: string) => {
    const ddbSource = new appsync.CfnDataSource(scope, 'DynamoDataSource', {
        apiId: apiId,
        name: 'DYNAMO_DB',
        type: 'AMAZON_DYNAMODB',
        dynamoDbConfig: {
            awsRegion: AWS_REGION,
            tableName: tableName
        },
        serviceRoleArn: roleArn
    });

    return ddbSource;
};

const buildESSource = (scope: cdk.Construct, apiId: string, domainEndpoint: string, roleArn: string) => {
    const esSource = new appsync.CfnDataSource(scope, 'ESDataSource', {
        apiId: apiId,
        name: 'ELASTIC_SEARCH',
        type: 'AMAZON_ELASTICSEARCH',
        elasticsearchConfig: {
            awsRegion: AWS_REGION,
            endpoint: `https://${domainEndpoint}`
        },
        serviceRoleArn: roleArn
    });

    return esSource;
};

const buildHTTPSource = (scope: cdk.Construct, apiId: string, url: string) => {
    const httpSource = new appsync.CfnDataSource(scope, 'HTTPDataSource', {
        apiId: apiId,
        name: 'EXISTING_API',
        type: 'HTTP',
        httpConfig: {
            endpoint: url
        }
    });

    return httpSource;
};

const buildLambdaSource = (scope: cdk.Construct, apiId: string, fnArn: string, roleArn: string) => {
    const lambdaSource = new appsync.CfnDataSource(scope, 'LambdaDataSource', {
        apiId: apiId,
        name: 'UPDATE_LAMBDA',
        type: 'AWS_LAMBDA',
        lambdaConfig: {
            lambdaFunctionArn: fnArn
        },
        serviceRoleArn: roleArn
    });

    return lambdaSource;
};

const buildDDBResolver = (scope: cdk.Construct, apiId: string, sourceName: string) => {
    new appsync.CfnResolver(scope, 'DDBResolver', {
        apiId: apiId,
        dataSourceName: sourceName,
        typeName: 'Query',
        fieldName: 'getCompany',
        requestMappingTemplate: requestTemplate('getCompany'),
        responseMappingTemplate: responseTemplate('getCompany')
    });
};

const buildESResolver = (scope: cdk.Construct, apiId: string, sourceName: string) => {
    new appsync.CfnResolver(scope, 'ESResolver', {
        apiId: apiId,
        dataSourceName: sourceName,
        typeName: 'Query',
        fieldName: 'stockHistogram',
        requestMappingTemplate: requestTemplate('stockHistogram'),
        responseMappingTemplate: responseTemplate('stockHistogram')
    });
};

const buildHTTPResolver = (scope: cdk.Construct, apiId: string, sourceName: string) => {
    new appsync.CfnResolver(scope, 'HTTPResolver', {
        apiId: apiId,
        dataSourceName: sourceName,
        typeName: 'Query',
        fieldName: 'listCompanies',
        requestMappingTemplate: requestTemplate('listCompanies'),
        responseMappingTemplate: responseTemplate('listCompanies')
    });
};

const buildLambdaResolver = (scope: cdk.Construct, apiId: string, sourceName: string) => {
    new appsync.CfnResolver(scope, 'LambdaResolver', {
        apiId: apiId,
        dataSourceName: sourceName,
        typeName: 'Mutation',
        fieldName: 'updateCompanyStock',
        requestMappingTemplate: requestTemplate('updateCompanyStock'),
        responseMappingTemplate: responseTemplate('updateCompanyStock')
    });
};

const DevLoungeAppSync = (stack: IDevLoungeStack) => {
    const scope = (stack as unknown as cdk.Construct);

    // API
    const api = buildApi(scope, stack.Auth.userPoolId);
    const apiId = api.graphQlApiApiId;

    // Schema
    buildSchema(scope, apiId);

    // Data Sources
    const role = buildRole(scope);
    const ddbSource = buildDDBSource(scope, apiId, stack.Table.tableName, role.roleArn);
    const esSource = buildESSource(scope, apiId, stack.ESDomain.domainEndpoint, role.roleArn);
    const httpSource = buildHTTPSource(scope, apiId, stack.API.url);
    const lambdaSource = buildLambdaSource(scope, apiId, stack.Functions['update-stock'].functionArn, role.roleArn);

    // Resolvers
    buildDDBResolver(scope, apiId, ddbSource.dataSourceName);
    buildESResolver(scope, apiId, esSource.dataSourceName);
    buildHTTPResolver(scope, apiId, httpSource.dataSourceName);
    buildLambdaResolver(scope, apiId, lambdaSource.dataSourceName);

    stack.AppSync = api;

    return stack;
};

export default DevLoungeAppSync;
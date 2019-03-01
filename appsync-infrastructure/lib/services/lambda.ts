import * as cdk from '@aws-cdk/cdk';
import * as iam from '@aws-cdk/aws-iam';

import { DloungeFn } from '../helper/functions';
import IDevLoungeStack from '../interfaces/IDevLoungeStack';

const DDB_TABLE_NAME = process.env.DDB_TABLE_NAME || '';
const DDB_NUM_COMPANIES_SEED = process.env.DDB_NUM_COMPANIES_SEED || '';

const DevLoungeFunctions = (stack: IDevLoungeStack) => {
    const scope = (stack as unknown as cdk.Construct);

    const esEndpoint = stack.ESDomain.domainEndpoint;
    const fnRole = new iam.Role(scope, 'lambda_execution_role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        roleName: 'lambda_execution_role',
        managedPolicyArns: [
            'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess'
        ]
    });
    fnRole.addToPolicy(
        new iam.PolicyStatement()
        .addAllResources()
        .addActions("es:ESHttpPost", "es:ESHttpPut", "es:ESHttpDelete")
    );

    const fn = DloungeFn(scope);

    const ddbToEs = fn('ddb-to-es', {
        role: fnRole,
        environment: { ['ES_ENDPOINT']: esEndpoint } 
    });
    // DynamoEventSource support has just been merged, waiting for new release
    // ddbToEs.addEventSource(new DynamoEventSource(table, {
    //   startingPosition: lambda.StartingPosition.TrimHorizon
    // }));

    // Hence doing this for now
    const ddbToEsTrigger = fn('ddb-to-es-trigger', {
        role: fnRole,
        environment: {
            ['TABLE_ARN']: stack.Table.tableStreamArn,
            ['LAMBDA_ARN']: ddbToEs.functionArn
        }
    });

    const esSetup = fn('es-setup', {
        role: fnRole,
        environment: { ['ES_ENDPOINT']: esEndpoint } 
    });

    const esStockValue = fn('es-stock-value', {
        role: fnRole,
        environment: { ['ES_ENDPOINT']: esEndpoint } 
    });

    const getCompany = fn('get-company', {
        role: fnRole,
        environment: { ['DDB_TABLE_NAME']: DDB_TABLE_NAME } 
    });

    const getCompanyStock = fn('get-company-stock', {
        role: fnRole,
        environment: { ['DDB_TABLE_NAME']: DDB_TABLE_NAME } 
    });

    const listCompanies = fn('list-companies', {
        role: fnRole,
        environment: { ['DDB_TABLE_NAME']: DDB_TABLE_NAME } 
    });

    const seedDDB = fn('seed-dynamo-data', {
        role: fnRole,
        environment: {
            ['DDB_TABLE_NAME']: DDB_TABLE_NAME,
            ['NUM_COMPANIES']: DDB_NUM_COMPANIES_SEED
        }
    });

    const updateStock = fn('update-stock', {
        role: fnRole,
        environment: { ['DDB_TABLE_NAME']: DDB_TABLE_NAME } 
    });

    stack.Functions = {
        ['es-stock-value']: esStockValue,
        ['get-company']: getCompany,
        ['get-company-stock']: getCompanyStock,
        ['list-companies']: listCompanies,
        ['update-stock']: updateStock,
        ['es-setup']: esSetup,
        ['seed-ddb']: seedDDB,
        ['ddb-to-es']: ddbToEs,
        ['ddb-to-es-trigger']: ddbToEsTrigger
    };

    return stack;
};

export default DevLoungeFunctions;
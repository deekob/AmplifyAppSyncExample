import * as cdk from '@aws-cdk/cdk';
import * as cognito from '@aws-cdk/aws-cognito';

import IDevLoungeStack from '../interfaces/IDevLoungeStack';

const USER_POOL_NAME = process.env.USER_POOL_NAME || '';

const DevLoungeAuth = (stack: IDevLoungeStack) => {
    const scope = (stack as unknown as cdk.Construct);
    const pool = new cognito.CfnUserPool(scope, USER_POOL_NAME, {
        userPoolName: USER_POOL_NAME
    });

    new cognito.CfnUserPoolClient(scope, 'WebClient', {
        userPoolId: pool.userPoolId,
        clientName: 'web_client'
    });

    stack.Auth = pool;

    return stack;
};

export default DevLoungeAuth;
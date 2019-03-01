import * as elasticsearch from '@aws-cdk/aws-elasticsearch';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cognito from '@aws-cdk/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';

import IDevLoungeFunctions from './IDevLoungeFunctions';

export default interface IDevLoungeStack {
    API: apigateway.RestApi;
    ESDomain: elasticsearch.CfnDomain;
    Table: dynamodb.Table;
    Functions: IDevLoungeFunctions;
    Auth: cognito.CfnUserPool;
    AppSync: appsync.CfnGraphQLApi;
    Orchestration: stepfunctions.StateMachine;
};
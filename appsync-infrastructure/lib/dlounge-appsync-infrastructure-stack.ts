import * as cdk from '@aws-cdk/cdk';
import * as elasticsearch from '@aws-cdk/aws-elasticsearch';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cognito from '@aws-cdk/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';
import * as dotenv from "dotenv";

dotenv.config();

import IDevLoungeFunctions from './interfaces/IDevLoungeFunctions';
import IDevLoungeStack from './interfaces/IDevLoungeStack';

import DevLoungeTable from './services/dynamo';
import DevLoungeES from './services/elasticsearch';
import DevLoungeFunctions from './services/lambda';
import DevLoungeAPI from './services/apigateway';
import DevLoungeAuth from './services/cognito';
import DevLoungeAppSync from './services/appsync';
import DevLoungeOrchestration from './services/stepfunctions';

const compose = <T>(fn1: (a: T) => T, ...fns: Array<(a: T) => T>) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);

export class DloungeAppsyncInfrastructureStack extends cdk.Stack implements IDevLoungeStack {
  private _api: apigateway.RestApi;
  private _esDomain: elasticsearch.CfnDomain;
  private _table: dynamodb.Table;
  private _functions: IDevLoungeFunctions;
  private _auth: cognito.CfnUserPool;
  private _appSync: appsync.CfnGraphQLApi;
  private _orchestration: stepfunctions.StateMachine;

  set API(val) {
    this._api = val;
  }

  get API() {
    return this._api;
  }

  set Auth(val) {
    this._auth = val;
  }

  get Auth() {
    return this._auth;
  }

  set Table(val) {
    this._table = val;
  }

  get Table() {
    return this._table;
  }

  set ESDomain(val) {
    this._esDomain = val;
  }

  get ESDomain() {
    return this._esDomain;
  }

  set AppSync(val) {
    this._appSync = val;
  }

  get AppSync() {
    return this._appSync;
  }

  set Functions(val) {
    this._functions = val;
  }

  get Functions() {
    return this._functions;
  }

  set Orchestration(val) {
    this._orchestration = val;
  }

  get Orchestration() {
    return this._orchestration;
  }

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const run = compose(
      DevLoungeOrchestration,
      DevLoungeAppSync,
      DevLoungeAPI,
      DevLoungeAuth,
      DevLoungeFunctions,
      DevLoungeTable,
      DevLoungeES,
    );
    
    run(this);
  }
}

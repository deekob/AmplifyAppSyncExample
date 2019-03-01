#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import { DloungeAppsyncInfrastructureStack } from '../lib/dlounge-appsync-infrastructure-stack';

const app = new cdk.App();
new DloungeAppsyncInfrastructureStack(app, 'DloungeAppsyncInfrastructureStack');
app.run();

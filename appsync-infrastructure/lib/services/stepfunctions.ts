import * as cdk from '@aws-cdk/cdk';
import * as stepfunctions from '@aws-cdk/aws-stepfunctions';

import IDevLoungeStack from '../interfaces/IDevLoungeStack';

const DevLoungeOrchestration = (stack: IDevLoungeStack) => {
    const scope = (stack as unknown as cdk.Construct);

    const fns = stack.Functions;
    const esSetup = new stepfunctions.Task(scope, 'Create ES Index', {
        resource: fns['es-setup']
    });

    const seedDDB = new stepfunctions.Task(scope, 'Seed Company Table', {
        resource: fns['seed-ddb']
    });

    const ddbToEs = new stepfunctions.Task(scope, 'DDB to ES setup', {
        resource: fns['ddb-to-es-trigger']
    });

    const definition = 
        esSetup
            .next(seedDDB)
            .next(ddbToEs);

    const state = new stepfunctions.StateMachine(scope, 'StateMachine', {
        definition,
        timeoutSec: 300
    });

    stack.Orchestration = state;

    return stack;
};

export default DevLoungeOrchestration;
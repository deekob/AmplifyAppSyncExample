import * as cdk from '@aws-cdk/cdk';
import * as apigateway from '@aws-cdk/aws-apigateway';

export const cors = (apiResource: apigateway.IRestApiResource) => {
  const options = apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.Never,
    contentHandling: apigateway.ContentHandling.ConvertToText,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }))
  const methodResource = (options as cdk.Construct).node.findChild("Resource") as apigateway.CfnMethod
  methodResource.propertyOverrides.methodResponses = [{
    statusCode: '200',
    responseModels: {
      'application/json': 'Empty'
    },
    responseParameters: {
      'method.response.header.Access-Control-Allow-Headers': true,
      'method.response.header.Access-Control-Allow-Methods': true,
      'method.response.header.Access-Control-Allow-Credentials': true,
      'method.response.header.Access-Control-Allow-Origin': true,
    },
  }];
};
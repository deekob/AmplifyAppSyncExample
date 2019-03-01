const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.DDB_TABLE_NAME || "devlounge-q4-2018-company";

exports.handler = async evt => {
    try {
        var params = {
            "TableName" : tableName,
            "Key": {
                "company_id": Number(evt.pathParameters.id)
            },
            "ProjectionExpression": "stock_value"
        };
        const result = await ddb.get(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result),
            headers: {
                "X-Requested-With": '*',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials" : true ,
                "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
                "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token"
                
            }
        };
    }
    catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: 'Get company failed',
            headers: { }   
        };
    }
};
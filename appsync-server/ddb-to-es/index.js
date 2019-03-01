var AWS         = require('aws-sdk');
var path        = require('path');
var endpoint    = new AWS.Endpoint(process.env.ES_ENDPOINT);
var creds       = new AWS.EnvironmentCredentials('AWS');
var region      = process.env.REGION || 'ap-southeast-2';

var esDomain = {
    region: region,
    endpoint: process.env.ES_ENDPOINT,
    index: 'stocks',
    doctype: 'stock_event'
};

exports.handler = function(event, context) 
{
    console.log(JSON.stringify(event, null, '  '));
    
    event.Records.forEach(function(record) 
    {
        if ( record.dynamodb.NewImage )
        {
            console.log("Processing: " + JSON.stringify(record.dynamodb));
            postToES(record.dynamodb.NewImage, context);
        }
        else
        {
            console.log("Skipping: " + JSON.stringify(record.dynamodb));
        }
    });
}

function postToES(record, context) 
{
    var req = new AWS.HttpRequest(endpoint);

    req.method = 'POST';
    req.path = path.join('/', esDomain.index, esDomain.doctype);
    req.region = esDomain.region;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.body = JSON.stringify({
        "timestamp" : new Date().getTime(),
        "companyId" : record.company_id.N,
        "stockValue": record.stock_value.N,
        "delta" : record.delta.N
    });

    var signer = new AWS.Signers.V4(req , 'es');  // es: service code
    signer.addAuthorization(creds, new Date());

    var send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function(httpResp) {
        var respBody = '';
        httpResp.on('data', function (chunk) {
            respBody += chunk;
        });
        httpResp.on('end', function (chunk) {
            console.log('Response: ' + respBody);
            context.succeed('Lambda added document ' + req.body);
        });
    }, function(err) {
        console.log('Error: ' + err);
        context.fail('Lambda failed with error ' + err);
    });
}
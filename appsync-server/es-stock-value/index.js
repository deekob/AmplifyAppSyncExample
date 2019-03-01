const AWS = require('aws-sdk');
const path = require('path');
const ES_ENDPOINT = process.env.ES_ENDPOINT || '';
const endpoint = new AWS.Endpoint(ES_ENDPOINT);
const credentials = new AWS.EnvironmentCredentials('AWS');
const region = process.env.REGION || 'ap-southeast-2';

const esDomain = {
    region,
    endpoint: ES_ENDPOINT,
    index: 'stocks',
    search: '_search?size=0'
};

const getStockHistory = async (companyId, limit) => {
    return new Promise((res, rej) => {
        const request = new AWS.HttpRequest(endpoint);
        request.method = 'POST';
        request.path = path.join('/', esDomain.index, esDomain.search);
        request.region = esDomain.region;
        request.headers['presigned-expires'] = false;
        request.headers['Host'] = endpoint.host;
        request.body = JSON.stringify({
            "aggs": {
                "top_tags": {
                    "filter": {
                        "term": { "companyId": companyId }	
                    },
                    "aggs": {
                        "latest_stock_prices": {
                            "top_hits": {
                                "sort": [
                                    {
                                        "timestamp": {
                                            "order": "desc"
                                        }
                                    }
                                ],
                                "_source": {
                                    "includes": [ "companyId", "stockValue", "delta" ]
                                },
                                "size" : 10
                            }
                        }
                    }
                }
            }
        });
    
        const signer = new AWS.Signers.V4(request, 'es');
        signer.addAuthorization(credentials, new Date());
    
        const client = new AWS.NodeHttpClient();
        client.handleRequest(request, null, httpResp => {
            let respBody = '';
            httpResp.on('data', chunk => {
                respBody += chunk;
            });
            httpResp.on('end', _ => {
                res(respBody);
            });
        }, err => {
            console.log('Error: ' + err);
            rej(err);
        });
    });
};

exports.handler = async evt => {
    try {
        const companyId = evt.pathParameters.id;
        const result = await getStockHistory(companyId, 10);
        const hits = JSON.parse(result).aggregations.top_tags.latest_stock_prices.hits.hits;
        return {
            statusCode: 200,
            body: JSON.stringify(hits),
            headers: {
                "X-Requested-With": '*',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials" : true ,
                "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
                "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token"
                
            }
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: 'Retrieving histogram stock failed',
            headers: { }   
        };
    }
};
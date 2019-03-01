const AWS = require('aws-sdk');
const faker = require('faker');
const ddb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.DDB_TABLE_NAME || "devlounge-q4-2018-company";
const NUM_COMPANIES = process.env.NUM_COMPANIES || 10;

const generate = howMany => 
    Array.from({length: howMany}, (_, k) => 
    (
        {
            company_id: ++k,
            company_name: faker.company.companyName(),
            company_description: faker.lorem.paragraph(),
            delta: 0,
            stock_name: faker.name.lastName(),
            stock_value: Number(faker.finance.amount())
        }
    ));
const dataToItem = items =>
    items.map(item => ({ PutRequest: { Item: item } }));

exports.handler = async evt => {
    try {
        const data = generate(NUM_COMPANIES);
        const items = dataToItem(data);
        const params = {
            "RequestItems": {
                [tableName]: items
            }
        };
        const result = await ddb.batchWrite(params).promise();
        return 'Seed operation succeded';
    }
    catch (err) {
        console.log(err);
        return 'Seed operation failed';
    }
};
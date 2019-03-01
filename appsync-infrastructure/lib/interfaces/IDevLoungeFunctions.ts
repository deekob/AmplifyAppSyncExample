import { IFunction } from '@aws-cdk/aws-lambda';

export default interface APIFunctions {
  ['list-companies']: IFunction,
  ['get-company']: IFunction,
  ['es-stock-value']: IFunction,
  ['update-stock']: IFunction,
  ['get-company-stock']: IFunction,
  ['es-setup']: IFunction,
  ['seed-ddb']: IFunction,
  ['ddb-to-es']: IFunction,
  ['ddb-to-es-trigger']: IFunction
}
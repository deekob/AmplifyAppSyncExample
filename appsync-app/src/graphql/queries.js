// Query that will return a list of Companies
export const ListCompanies = `query ListCompanies {
    listCompanies { 
        company_id 
        company_name
        stock_name
        stock_value
    }
}`;
// Query that will return a Company given its ID
export const GetCompany = `query GetCompany($id: Int!) {
    getCompany(id: $id){
        company_name
        company_description
        stock_value
     }
 }`;

 // Query to retrieve the stock price history for a company
export const GetHistogram = `query GetHistogram($company_id: Int!, $limit: Int!) {
    stockHistogram(company_id: $company_id, limit: $limit) {
             stock_value
       }
     }`;


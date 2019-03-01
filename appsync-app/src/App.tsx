import Amplify from 'aws-amplify';
//@ts-ignore
import { withAuthenticator } from 'aws-amplify-react';
import React, { Component } from 'react';

import aws_exports from './aws-exports';
import StockTable from './StockTable';

require('dotenv').config();
Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <StockTable />
    )
  }
}

export default withAuthenticator(App, false);
